import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNoteFormContext } from "../encounter-content/form";
import { MicIcon, SquareIcon, FileIcon, ClipboardIcon, CheckIcon, BugIcon } from "lucide-react";
import { 
  EntitySectionTitle, 
  EntitySectionContent, 
  EntityFieldContent, 
  EntityFieldTitle 
} from "../ui/entityContent";
import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SCRIBEAI_API_KEY, API_BASE_URL } from "@/config/env";

// Interface for parsed note sections
interface ParsedNote {
  subjective: {
    generalNotes?: string;
    chiefComplaint?: string;
    historyOfPresentIllness?: string;
    reviewOfSystems?: string;
  };
  objective: {
    generalNotes?: string;
    physicalExamNotes?: string;
  };
  assessment: {
    generalNotes?: string;
  };
  plan: {
    generalNotes?: string;
  };
  patientInstructions: {
    generalNotes?: string;
  };
}

export const ScribeAIIntegration = () => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState("");
  const [parsedNote, setParsedNote] = useState<ParsedNote | null>(null);
  const [customNotes, setCustomNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [autoApply, setAutoApply] = useState(false);
  const [isNotePreviewOpen, setIsNotePreviewOpen] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [formFieldsInfo, setFormFieldsInfo] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get form context to update the encounter form fields
  const { setValue, getValues, formState } = useNoteFormContext();

  // Effect to auto-apply note when generated if autoApply is enabled
  useEffect(() => {
    if (autoApply && parsedNote) {
      // Check if parsedNote has any content before attempting to apply
      const hasContent = 
        (parsedNote.subjective.generalNotes && parsedNote.subjective.generalNotes.trim() !== "") ||
        (parsedNote.subjective.chiefComplaint && parsedNote.subjective.chiefComplaint.trim() !== "") ||
        (parsedNote.subjective.historyOfPresentIllness && parsedNote.subjective.historyOfPresentIllness.trim() !== "") ||
        (parsedNote.subjective.reviewOfSystems && parsedNote.subjective.reviewOfSystems.trim() !== "") ||
        (parsedNote.objective.generalNotes && parsedNote.objective.generalNotes.trim() !== "") ||
        (parsedNote.objective.physicalExamNotes && parsedNote.objective.physicalExamNotes.trim() !== "") ||
        (parsedNote.assessment.generalNotes && parsedNote.assessment.generalNotes.trim() !== "") ||
        (parsedNote.plan.generalNotes && parsedNote.plan.generalNotes.trim() !== "") ||
        (parsedNote.patientInstructions.generalNotes && parsedNote.patientInstructions.generalNotes.trim() !== "");
      
      if (!hasContent) {
        console.warn("Auto-apply skipped: Note has no content");
        return;
      }
      
      // Add a small delay to ensure the form is ready
      const timer = setTimeout(() => {
        try {
          applyParsedNote();
        } catch (error) {
          console.error("Error in auto-apply:", error);
          // Show a toast notification for the error
          toast({ 
            variant: "destructive", 
            title: "Auto-apply failed", 
            description: "Failed to automatically apply the note to the form. Try applying manually."
          });
        }
      }, 1000); // Increased delay to 1 second
      
      return () => clearTimeout(timer);
    }
  }, [parsedNote, autoApply]);

  // Debug function to check available form fields
  const checkFormFields = () => {
    try {
      const currentValues = getValues();
      const formInfo = {
        availableFields: Object.keys(currentValues),
        dirtyFields: Object.keys(formState.dirtyFields || {}),
        errors: formState.errors,
        isValid: formState.isValid,
      };
      
      setFormFieldsInfo(JSON.stringify(formInfo, null, 2));
      console.log("Form fields info:", formInfo);
      
      toast({
        variant: "default",
        title: "Form fields checked",
        description: `Found ${formInfo.availableFields.length} available fields`
      });
    } catch (error) {
      console.error("Error checking form fields:", error);
      setFormFieldsInfo(JSON.stringify({ error: String(error) }, null, 2));
      
      toast({
        variant: "destructive",
        title: "Error checking form fields",
        description: String(error)
      });
    }
  };

  // Parse the generated note into sections
  const parseGeneratedNote = (note: string): ParsedNote => {
    // Initialize with empty sections
    const parsed: ParsedNote = {
      subjective: {},
      objective: {},
      assessment: {},
      plan: {},
      patientInstructions: {}
    };
    
    if (!note || typeof note !== 'string') {
      console.error("Invalid note format:", note);
      return parsed;
    }
    
    // Normalize the note text to make parsing more reliable
    const normalizedNote = note
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    if (debugMode) {
      console.log("Normalized note for parsing:", normalizedNote);
    }
    
    // Extract major sections first
    const sections: Record<string, string> = {};
    
    // Match section headers and their content
    const majorSectionMatches = normalizedNote.match(/(?:^|\n)(SUBJECTIVE|OBJECTIVE|ASSESSMENT|PLAN|PATIENT INSTRUCTIONS):\s*([^]*?)(?=\n(?:SUBJECTIVE|OBJECTIVE|ASSESSMENT|PLAN|PATIENT INSTRUCTIONS):|\n*$)/gi);
    
    if (majorSectionMatches) {
      for (const match of majorSectionMatches) {
        const sectionMatch = match.match(/^(?:\n)?(SUBJECTIVE|OBJECTIVE|ASSESSMENT|PLAN|PATIENT INSTRUCTIONS):\s*([^]*?)$/is);
        if (sectionMatch) {
          const [, sectionName, content] = sectionMatch;
          sections[sectionName.toUpperCase()] = content.trim();
        }
      }
    }
    
    // Process SUBJECTIVE section
    if (sections.SUBJECTIVE) {
      parsed.subjective.generalNotes = sections.SUBJECTIVE;
      
      // Extract chief complaint
      const ccMatch = sections.SUBJECTIVE.match(/(?:^|\n)Chief\s+Complaint:?\s*([^]*?)(?=\n[A-Z][a-z]+:|\n\n|$)/i);
        if (ccMatch) {
          parsed.subjective.chiefComplaint = ccMatch[1].trim();
        }
        
      // Extract HPI
      const hpiMatch = sections.SUBJECTIVE.match(/(?:^|\n)(?:History\s+of\s+Present\s+Illness|HPI):?\s*([^]*?)(?=\n[A-Z][a-z]+:|\n\n|$)/i);
        if (hpiMatch) {
          parsed.subjective.historyOfPresentIllness = hpiMatch[1].trim();
        }
        
      // Extract ROS
      const rosMatch = sections.SUBJECTIVE.match(/(?:^|\n)(?:Review\s+of\s+Systems|ROS):?\s*([^]*?)(?=\n[A-Z][a-z]+:|\n\n|$)/i);
        if (rosMatch) {
          parsed.subjective.reviewOfSystems = rosMatch[1].trim();
      }
    } else {
      // If no SUBJECTIVE section found, use the whole note
      parsed.subjective.generalNotes = normalizedNote;
    }
    
    // Process OBJECTIVE section
    if (sections.OBJECTIVE) {
      parsed.objective.generalNotes = sections.OBJECTIVE;
      
      // Extract physical exam - note the VIM API uses physicalExamNotes
      const peMatch = sections.OBJECTIVE.match(/(?:^|\n)(?:Physical\s+Exam(?:ination)?|PE):?\s*([^]*?)(?=\n[A-Z][a-z]+:|\n\n|$)/i);
        if (peMatch) {
          parsed.objective.physicalExamNotes = peMatch[1].trim();
      }
    }
    
    // Process ASSESSMENT section
    if (sections.ASSESSMENT) {
      parsed.assessment.generalNotes = sections.ASSESSMENT;
    }
    
    // Process PLAN section
    if (sections.PLAN) {
      parsed.plan.generalNotes = sections.PLAN;
    }
    
    // Process PATIENT INSTRUCTIONS section
    if (sections['PATIENT INSTRUCTIONS']) {
      parsed.patientInstructions.generalNotes = sections['PATIENT INSTRUCTIONS'];
    }
    
    // If we didn't find any sections, try a different approach
    if (!sections.SUBJECTIVE && !sections.OBJECTIVE && !sections.ASSESSMENT && !sections.PLAN) {
      // Look for common section indicators in unstructured text
      if (normalizedNote.match(/(?:chief\s+complaint|presenting\s+concern|reason\s+for\s+visit)/i)) {
        parsed.subjective.chiefComplaint = normalizedNote;
      }
      
      // Default to putting the entire note in subjective general notes
      parsed.subjective.generalNotes = normalizedNote;
    }
    
    // Ensure we have at least something in each major section
    if (!parsed.subjective.generalNotes) {
      parsed.subjective.generalNotes = "No subjective information available.";
    }
    
    if (!parsed.objective.generalNotes) {
      parsed.objective.generalNotes = "No objective information available.";
    }
    
    if (!parsed.assessment.generalNotes) {
      parsed.assessment.generalNotes = "No assessment information available.";
    }
    
    if (!parsed.plan.generalNotes) {
      parsed.plan.generalNotes = "No plan information available.";
    }
    
    if (debugMode) {
      console.log("Parsed note:", parsed);
    }
    
    return parsed;
  };

  // Sanitize text to remove or replace non-English characters
  const sanitizeText = (text: string | undefined): string => {
    if (!text) return "";
    
    // Replace common special characters that might cause validation issues
    return text
      // Replace smart quotes with regular quotes
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // Replace em-dashes and en-dashes with regular hyphens
      .replace(/[\u2013\u2014]/g, '-')
      // Replace ellipsis with three periods
      .replace(/\u2026/g, '...')
      // Replace bullet points with asterisks
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '*')
      // Replace degree symbol
      .replace(/\u00B0/g, ' degrees')
      // Replace fractions
      .replace(/\u00BC/g, '1/4')
      .replace(/\u00BD/g, '1/2')
      .replace(/\u00BE/g, '3/4')
      // Replace other common medical symbols
      .replace(/\u00B1/g, '+/-')  // Plus-minus sign
      .replace(/\u2264/g, '<=')   // Less than or equal to
      .replace(/\u2265/g, '>=')   // Greater than or equal to
      // Replace non-ASCII characters with empty string
      .replace(/[^\x00-\x7F]/g, '')
      // Replace multiple spaces with a single space
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Check if text contains non-English characters
  const containsNonEnglishChars = (text: string | undefined): boolean => {
    if (!text) return false;
    return /[^\x00-\x7F]/.test(text);
  };

  // Generate VIM note using the ScribeAI API
  const generateNote = async () => {
    if (!transcript || transcript.trim() === "") {
      toast({ 
        variant: "destructive", 
        title: "No transcript available", 
        description: "Please record or upload audio first to generate a transcript." 
      });
      return;
    }
    
    // Check if transcript is too short
    if (transcript.trim().length < 10) {
      toast({ 
        variant: "destructive", 
        title: "Transcript too short", 
        description: "The transcript is too short to generate a meaningful note. Please record more audio." 
      });
      return;
    }
    
    try {
      const jwtToken = SCRIBEAI_API_KEY;
      
      // Use the VIM endpoint
      const endpoint = `${API_BASE_URL}/api/notes/vim`;
      
      // Try to get patient context from the form if available
      const currentValues = getValues();
      const existingChiefComplaint = currentValues.subjectiveChiefComplaint || "";
      
      // Based on the API expectations for VIM endpoint
      const payload = {
        transcriptText: transcript,
        patientInfo: {
          name: "", // These can be populated from VIM if available
          dob: "",
          chiefComplaint: existingChiefComplaint,
          visitDate: new Date().toISOString().split('T')[0],
          weight: null
        },
        customNotes
      };
      
      setProcessingStatus("Generating clinical note...");
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`Note generation failed: ${errorDetail}`);
      }
      
      const data = await response.json();
      
      if (debugMode) {
        console.log("VIM API Response:", data);
      }
      
      // Handle the VIM note structure
      if (data.structuredContent) {
        // Parse the structured content directly
        const structuredData = data.structuredContent;
        
        // Create a formatted text version for display
        let noteText = "SUBJECTIVE:\n";
        
        if (structuredData.subjective?.chiefComplaint) {
          noteText += "Chief Complaint: " + structuredData.subjective.chiefComplaint + "\n\n";
        }
        
        if (structuredData.subjective?.historyOfPresentIllness) {
          noteText += "History of Present Illness: " + structuredData.subjective.historyOfPresentIllness + "\n\n";
        }
        
        if (structuredData.subjective?.reviewOfSystems) {
          noteText += "Review of Systems: " + structuredData.subjective.reviewOfSystems + "\n\n";
        }
        
        if (structuredData.subjective?.generalNotes) {
          noteText += structuredData.subjective.generalNotes + "\n\n";
        }
        
        noteText += "OBJECTIVE:\n";
        if (structuredData.objective?.physicalExamNotes) {
          noteText += "Physical Examination: " + structuredData.objective.physicalExamNotes + "\n\n";
        }
        
        if (structuredData.objective?.generalNotes) {
          noteText += structuredData.objective.generalNotes + "\n\n";
        }
        
        noteText += "ASSESSMENT:\n";
        if (structuredData.assessment?.generalNotes) {
          noteText += structuredData.assessment.generalNotes + "\n\n";
        }
        
        noteText += "PLAN:\n";
        if (structuredData.plan?.generalNotes) {
          noteText += structuredData.plan.generalNotes + "\n\n";
        }
        
        if (structuredData.patientInstructions?.generalNotes) {
          noteText += "PATIENT INSTRUCTIONS:\n" + structuredData.patientInstructions.generalNotes + "\n\n";
        }
        
        setGeneratedNote(noteText);
        
        // Create a parsed note object directly from the structured content
        const parsed: ParsedNote = {
          subjective: {
            generalNotes: sanitizeText(structuredData.subjective?.generalNotes),
            chiefComplaint: sanitizeText(structuredData.subjective?.chiefComplaint),
            historyOfPresentIllness: sanitizeText(structuredData.subjective?.historyOfPresentIllness),
            reviewOfSystems: sanitizeText(structuredData.subjective?.reviewOfSystems)
          },
          objective: {
            generalNotes: sanitizeText(structuredData.objective?.generalNotes),
            physicalExamNotes: sanitizeText(structuredData.objective?.physicalExamNotes)
          },
          assessment: {
            generalNotes: sanitizeText(structuredData.assessment?.generalNotes)
          },
          plan: {
            generalNotes: sanitizeText(structuredData.plan?.generalNotes)
          },
          patientInstructions: {
            generalNotes: sanitizeText(structuredData.patientInstructions?.generalNotes)
          }
        };
        
        setParsedNote(parsed);
      } else {
        // Fallback to text parsing if structured content is not available
        let noteText = "";
        
        if (data.note) {
          noteText = data.note;
        } else if (data.generatedNote) {
          noteText = data.generatedNote;
        } else if (typeof data === 'string') {
          noteText = data;
        } else {
          // If we can't parse the response, create a simple note with the transcript
          noteText = "SUBJECTIVE:\n" + transcript + "\n\n" +
                    "OBJECTIVE:\nSee transcript for details.\n\n" +
                    "ASSESSMENT:\nAssessment pending.\n\n" +
                    "PLAN:\nPlan pending.";
        }
        
        setGeneratedNote(noteText);
        
        // Parse the note text to extract sections
        const parsed = parseGeneratedNote(noteText);
        setParsedNote(parsed);
      }
      
      toast({ 
        variant: "default", 
        title: "Note generated successfully!",
        description: autoApply ? "Attempting to apply note to form..." : "Review and apply the note to the form."
      });
      
      // Open note preview
      setIsNotePreviewOpen(true);
      setProcessingStatus(null);
      
    } catch (error: any) {
      console.error("Error generating note:", error);
      toast({ 
        variant: "destructive", 
        title: "Error generating note", 
        description: error.message 
      });
      setProcessingStatus(null);
    }
  };

  // Apply the parsed note to the encounter form
  const applyParsedNote = () => {
    if (!parsedNote) {
      toast({ 
        variant: "destructive", 
        title: "No note to apply", 
        description: "Please generate a note first before applying to the form." 
      });
      return;
    }
    
    try {
      // Get current values to merge with new values
      const currentValues = getValues();
      
      if (debugMode) {
        console.log("Current form values:", currentValues);
        console.log("Parsed note to apply:", parsedNote);
        
        // Check for non-English characters in each field
        const nonEnglishFields: string[] = [];
        if (containsNonEnglishChars(parsedNote.subjective.generalNotes)) nonEnglishFields.push("Subjective General Notes");
        if (containsNonEnglishChars(parsedNote.subjective.chiefComplaint)) nonEnglishFields.push("Chief Complaint");
        if (containsNonEnglishChars(parsedNote.subjective.historyOfPresentIllness)) nonEnglishFields.push("History of Present Illness");
        if (containsNonEnglishChars(parsedNote.subjective.reviewOfSystems)) nonEnglishFields.push("Review of Systems");
        if (containsNonEnglishChars(parsedNote.objective.generalNotes)) nonEnglishFields.push("Objective General Notes");
        if (containsNonEnglishChars(parsedNote.objective.physicalExamNotes)) nonEnglishFields.push("Physical Exam Notes");
        if (containsNonEnglishChars(parsedNote.assessment.generalNotes)) nonEnglishFields.push("Assessment");
        if (containsNonEnglishChars(parsedNote.plan.generalNotes)) nonEnglishFields.push("Plan");
        if (containsNonEnglishChars(parsedNote.patientInstructions.generalNotes)) nonEnglishFields.push("Patient Instructions");
        
        if (nonEnglishFields.length > 0) {
          console.warn("Fields with non-English characters:", nonEnglishFields);
        }
      }
      
      // Validate that setValue is a function
      if (typeof setValue !== 'function') {
        throw new Error("setValue is not a function. Form context may not be properly initialized.");
      }
      
      // Check if any fields are available to update
      const availableFields = Object.keys(currentValues);
      if (availableFields.length === 0) {
        toast({ 
          variant: "destructive", 
          title: "No form fields available",
          description: "The form has no available fields to update."
        });
        return;
      }
      
      // Verify that we have at least one field with content to update
      const hasContent = 
        (parsedNote.subjective.generalNotes && parsedNote.subjective.generalNotes.trim() !== "") ||
        (parsedNote.subjective.chiefComplaint && parsedNote.subjective.chiefComplaint.trim() !== "") ||
        (parsedNote.subjective.historyOfPresentIllness && parsedNote.subjective.historyOfPresentIllness.trim() !== "") ||
        (parsedNote.subjective.reviewOfSystems && parsedNote.subjective.reviewOfSystems.trim() !== "") ||
        (parsedNote.objective.generalNotes && parsedNote.objective.generalNotes.trim() !== "") ||
        (parsedNote.objective.physicalExamNotes && parsedNote.objective.physicalExamNotes.trim() !== "") ||
        (parsedNote.assessment.generalNotes && parsedNote.assessment.generalNotes.trim() !== "") ||
        (parsedNote.plan.generalNotes && parsedNote.plan.generalNotes.trim() !== "") ||
        (parsedNote.patientInstructions.generalNotes && parsedNote.patientInstructions.generalNotes.trim() !== "");
      
      if (!hasContent) {
        toast({ 
          variant: "destructive", 
          title: "Empty note",
          description: "The generated note doesn't contain any content to apply to the form."
        });
        return;
      }
      
      // Define all field mappings between parsedNote and form fields
      const fieldMappings = [
        { field: 'subjectiveGeneralNotes', content: sanitizeText(parsedNote.subjective.generalNotes), label: 'Subjective General Notes' },
        { field: 'subjectiveChiefComplaint', content: sanitizeText(parsedNote.subjective.chiefComplaint), label: 'Chief Complaint' },
        { field: 'subjectiveHistoryOfPresentIllness', content: sanitizeText(parsedNote.subjective.historyOfPresentIllness), label: 'History of Present Illness' },
        { field: 'subjectiveReviewOfSystems', content: sanitizeText(parsedNote.subjective.reviewOfSystems), label: 'Review of Systems' },
        { field: 'objectiveGeneralNotes', content: sanitizeText(parsedNote.objective.generalNotes), label: 'Objective General Notes' },
        { field: 'objectivePhysicalExamNotes', content: sanitizeText(parsedNote.objective.physicalExamNotes), label: 'Physical Exam Notes' },
        { field: 'assessmentGeneralNotes', content: sanitizeText(parsedNote.assessment.generalNotes), label: 'Assessment' },
        { field: 'planGeneralNotes', content: sanitizeText(parsedNote.plan.generalNotes), label: 'Plan' },
        { field: 'patientInstructionsGeneralNotes', content: sanitizeText(parsedNote.patientInstructions.generalNotes), label: 'Patient Instructions' }
      ];
      
      // Track which fields were successfully updated
      const updatedFields: string[] = [];
      
      // Try to update all fields
      for (const mapping of fieldMappings) {
        if (mapping.field in currentValues && mapping.content) {
          try {
            // Update the field
            setValue(mapping.field as any, mapping.content, { 
              shouldDirty: true, 
              shouldValidate: true, 
              shouldTouch: true 
            });
            
            // Add to list of updated fields
            updatedFields.push(mapping.label);
          } catch (error) {
            console.error(`Error updating ${mapping.label}:`, error);
            // Continue to next field
          }
        }
      }
      
      // Show success message with all updated fields
      if (updatedFields.length > 0) {
        toast({ 
          variant: "default", 
          title: "Note applied to form successfully!",
          description: `Updated: ${updatedFields.join(', ')}`
        });
      } else {
        // If we couldn't update any fields
        toast({ 
          variant: "default", 
          title: "No fields updated",
          description: "Could not update any form fields. The note is still available in the preview."
        });
      }
      
    } catch (error: any) {
      console.error("Error applying note to form:", error);
      
      // Enhanced error logging for validation errors
      if (error.message && error.message.includes("validation")) {
        console.error("Validation error details:", JSON.stringify(error));
        
        if (debugMode) {
          // Show more detailed error in toast for debugging
          toast({ 
            variant: "destructive", 
            title: "Validation Error", 
            description: `Error details: ${JSON.stringify(error).substring(0, 200)}...`
          });
        } else {
          toast({ 
            variant: "destructive", 
            title: "Validation Error", 
            description: "The note contains characters or formatting that cannot be saved. Try editing the note manually."
          });
        }
      }
      // Check for the specific validation error
      else if (error.message && error.message.includes("No fields were specified in the update request")) {
        toast({ 
          variant: "default", 
          title: "Note available in preview",
          description: "The note couldn't be applied to the form but is available in the preview section."
        });
      } else {
        toast({ 
          variant: "destructive", 
          title: "Error applying note to form", 
          description: String(error)
        });
      }
    }
  };

  // Handle recording toggle
  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          // Stop the media recorder
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          setProcessingStatus("Processing audio...");
          // We'll let the onstop handler handle the rest
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        toast({ 
          variant: "destructive", 
          title: "Error stopping recording", 
          description: error instanceof Error ? error.message : "Unknown error" 
        });
        setIsRecording(false);
        setProcessingStatus(null);
      }
    } else {
      try {
        // Clear previous recording data
        recordedChunksRef.current = [];
        
        // Start a new recording
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        
        // Choose the best available format
        let recorderOptions: MediaRecorderOptions | undefined;
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          recorderOptions = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          recorderOptions = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          recorderOptions = { mimeType: 'audio/ogg' };
        }
        
        const mediaRecorder = recorderOptions 
          ? new MediaRecorder(stream, recorderOptions)
          : new MediaRecorder(stream);
        
        mediaRecorderRef.current = mediaRecorder;
        
        // Collect audio chunks
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };
        
        // When recording stops, upload the audio
        mediaRecorder.onstop = async () => {
          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
          
          const chunks = [...recordedChunksRef.current];
          if (chunks.length === 0) {
            toast({ 
              variant: "destructive", 
              title: "No audio recorded", 
              description: "No audio data was captured. Please try again." 
            });
            setProcessingStatus(null);
            return;
          }
          
          // Create a blob from the audio chunks
          const mimeType = recorderOptions?.mimeType || 'audio/webm';
          const audioBlob = new Blob(chunks, { type: mimeType });
          
          // Create a File object from the Blob
          const fileName = `recording_${new Date().toISOString()}.webm`;
          const audioFile = new File([audioBlob], fileName, { type: mimeType });
          
          // Upload the audio file
          await uploadAudioFile(audioFile);
        };
        
        // Start recording
        mediaRecorder.start(1000); // Collect data every second
        setIsRecording(true);
        toast({ variant: "default", title: "Recording started" });
      } catch (error) {
        console.error("Error starting recording:", error);
        toast({ 
          variant: "destructive", 
          title: "Error starting recording", 
          description: error instanceof Error ? error.message : "Unknown error" 
        });
        setProcessingStatus(null);
      }
    }
  };

  // Helper function to upload the audio file
  const uploadAudioFile = async (file: File) => {
    setUploading(true);
    try {
      const jwtToken = SCRIBEAI_API_KEY;
      
      const formData = new FormData();
      formData.append("audioFile", file);

      setProcessingStatus("Uploading and transcribing recording...");
      
      const response = await fetch(`${API_BASE_URL}/api/transcribe-file`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`File transcription failed: ${errorDetail}`);
      }
      
      const data = await response.json();
      
      // Extract the new transcript text
      let newTranscript = "";
      if (data.transcript) {
        newTranscript = data.transcript;
      } else if (data.transcriptText) {
        newTranscript = data.transcriptText;
      } else {
        console.warn("No transcript found in response:", data);
        newTranscript = "Transcription completed but no text was returned.";
      }
      
      // Append the new transcript to the existing one with proper formatting
      setTranscript(prevTranscript => {
        if (!prevTranscript) return newTranscript;
        return `${prevTranscript}\n\n--- New Transcription ---\n${newTranscript}`;
      });
      
      toast({ 
        variant: "default", 
        title: "Recording transcribed successfully!", 
        description: "Click 'Generate Note' to create a clinical note."
      });
      setProcessingStatus(null); // Clear the processing status
      
      // Remove automatic note generation
      // if (newTranscript) {
      //   await generateNote();
      // }
    } catch (error: any) {
      console.error("Transcription error:", error);
      toast({ 
        variant: "destructive", 
        title: "Error transcribing recording", 
        description: error.message 
      });
      setProcessingStatus(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle audio file upload transcription
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingStatus("Processing uploaded audio file...");
    await uploadAudioFile(file);
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Copy generated note to clipboard
  const copyToClipboard = () => {
    if (generatedNote) {
      navigator.clipboard.writeText(generatedNote);
      toast({ 
        variant: "default", 
        title: "Copied to clipboard",
        description: "The generated note has been copied to your clipboard."
      });
    }
  };

  return (
    <div className="border rounded-md my-4 bg-gray-50 p-4">
      <EntitySectionTitle title="ScribeAI Note Generator" />
      <EntitySectionContent>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Button 
          variant={isRecording ? "destructive" : "outline"} 
          onClick={handleRecording}
          disabled={uploading}
          className="flex items-center"
        >
          {isRecording ? (
            <>
              <SquareIcon className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <MicIcon className="mr-2 h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={triggerFileUpload}
          disabled={uploading || isRecording}
          className="flex items-center"
        >
          <FileIcon className="mr-2 h-4 w-4" />
          Upload Audio
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="flex-grow"></div>
        
        {/* <div className="flex items-center space-x-2">
          <Switch
            id="auto-apply"
            checked={autoApply}
            onCheckedChange={setAutoApply}
          />
          <Label htmlFor="auto-apply">Auto-apply to form</Label>
        </div> */}
        
        {/* <div className="flex items-center space-x-2">
          <Switch
            id="debug-mode"
            checked={debugMode}
            onCheckedChange={setDebugMode}
          />
          <Label htmlFor="debug-mode">Debug Mode</Label>
        </div> */}
        
        {debugMode && (
          <Button 
            variant="outline" 
            onClick={checkFormFields}
            className="flex items-center"
          >
            <BugIcon className="mr-2 h-4 w-4" />
            Check Form Fields
          </Button>
        )}
      </div>
      
        {processingStatus && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            {processingStatus}
          </div>
        )}
        
        {/* Debug info */}
        {debugMode && formFieldsInfo && (
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="text-xs font-bold mb-1">Form Fields Debug Info:</h4>
            <pre className="text-xs overflow-auto max-h-40">{formFieldsInfo}</pre>
          </div>
        )}
        
        {/* Transcript area */}
        <EntityFieldContent>
          <EntityFieldTitle title="Transcript" />
          <Textarea
            className="w-full min-h-[100px]"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Transcript will appear here or type directly..."
        />
        </EntityFieldContent>
        
        <EntityFieldContent>
          <EntityFieldTitle title="Additional Notes" />
          <Textarea
            className="w-full min-h-[60px]"
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Enter any additional notes or context..."
        />
        </EntityFieldContent>
      
      <div className="flex space-x-2 mb-4">
        <Button 
          variant="default" 
          disabled={!transcript || uploading || isRecording} 
          onClick={generateNote}
          className="w-full"
        >
          Generate Note
        </Button>
        
        {parsedNote && (
          <Button 
            variant="outline" 
            onClick={applyParsedNote}
          >
              <CheckIcon className="mr-2 h-4 w-4" />
            Apply to Form
          </Button>
        )}
          
          {generatedNote && (
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
            >
              <ClipboardIcon className="mr-2 h-4 w-4" />
              Copy Note
            </Button>
          )}
      </div>
      
      {generatedNote && (
          <Collapsible 
            open={isNotePreviewOpen} 
            onOpenChange={setIsNotePreviewOpen}
            className="mt-4 border rounded-md overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between p-2">
                <span>Note Preview</span>
                <span>{isNotePreviewOpen ? '▲' : '▼'}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 bg-white">
            <pre className="whitespace-pre-wrap text-sm">{generatedNote}</pre>
          </div>
            </CollapsibleContent>
          </Collapsible>
      )}
      </EntitySectionContent>
    </div>
  );
}; 