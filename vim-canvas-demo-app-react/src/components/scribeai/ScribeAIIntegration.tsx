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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import your provided ScribeAI API key from the environment
const SCRIBEAI_API_KEY = import.meta.env.VITE_SCRIBEAI_API_KEY as string;

// Update to the correct API base URL from the documentation
const API_BASE_URL = "https://api-devs-8a32c93f7e2d.herokuapp.com";

const NOTE_TYPES = [
  { value: "soap", label: "SOAP Note" },
  { value: "progress", label: "Progress Note" },
  { value: "diagnostic", label: "Diagnostic Note" },
  { value: "psych", label: "Psychological Note" },
];

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
    physicalExam?: string;
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
  const [selectedNoteType, setSelectedNoteType] = useState("soap");
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
      // Add a small delay to ensure the form is ready
      const timer = setTimeout(() => {
        applyParsedNote();
      }, 500);
      
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
      
      // Extract physical exam
      const peMatch = sections.OBJECTIVE.match(/(?:^|\n)(?:Physical\s+Exam(?:ination)?|PE):?\s*([^]*?)(?=\n[A-Z][a-z]+:|\n\n|$)/i);
        if (peMatch) {
          parsed.objective.physicalExam = peMatch[1].trim();
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
    
    return parsed;
  };

  // Generate note using the selected ScribeAI endpoint
  const generateNote = async () => {
    if (!transcript) {
      toast({ 
        variant: "destructive", 
        title: "No transcript available", 
        description: "Please record or upload audio first to generate a transcript." 
      });
      return;
    }
    
    try {
      const jwtToken = SCRIBEAI_API_KEY;
      
      let endpoint = "";
      switch (selectedNoteType) {
        case "soap":
          endpoint = `${API_BASE_URL}/api/notes/soap`;
          break;
        case "progress":
          endpoint = `${API_BASE_URL}/api/notes/progress`;
          break;
        case "diagnostic":
          endpoint = `${API_BASE_URL}/api/notes/diagnostic`;
          break;
        case "psych":
          endpoint = `${API_BASE_URL}/api/notes/psych`;
          break;
        default:
          throw new Error("Invalid note type");
      }
      
      // Try to get patient context from the form if available
      const currentValues = getValues();
      const existingChiefComplaint = currentValues.subjectiveChiefComplaint || "";
      
      // Based on the API expectations
      const payload = {
        transcriptText: transcript,
        patientInfo: {
          name: "", // These can be populated from VIM if available
          dob: "",
          chiefComplaint: existingChiefComplaint,
          visitDate: new Date().toISOString().split('T')[0],
          weight: null
        },
        customNotes,
        selectedICDCodes: [],
        selectedCPTCodes: [],
        suggestedICDCodes: [],
        suggestedCPTCodes: [],
        // Request plain text output instead of structured to avoid JSON issues
        outputFormat: "text",
        includeSubsections: true,
        // Add a specific format request to get a clean SOAP note
        formatInstructions: "Please format as a standard SOAP note with clear section headers: SUBJECTIVE:, OBJECTIVE:, ASSESSMENT:, PLAN:, and PATIENT INSTRUCTIONS: if applicable. Include clear subsection headers like Chief Complaint:, History of Present Illness:, Review of Systems:, and Physical Examination:."
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
      
      // Ensure we get plain text output, not JSON
      let noteText = "";
      
      if (data.note) {
        noteText = data.note;
      } else if (data.generatedNote) {
        noteText = data.generatedNote;
      } else if (typeof data === 'string') {
        noteText = data;
      } else if (data.structuredNote) {
        // If we still get structured data, convert it to text
        try {
          const structuredData = data.structuredNote;
          noteText = "SUBJECTIVE:\n";
          
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
          if (structuredData.objective?.physicalExam) {
            noteText += "Physical Examination: " + structuredData.objective.physicalExam + "\n\n";
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
        } catch (err) {
          console.error("Error converting structured data to text:", err);
          // Create a simple SOAP note from the JSON
          noteText = "SUBJECTIVE:\nUnable to parse structured data.\n\n" +
                    "OBJECTIVE:\nSee transcript for details.\n\n" +
                    "ASSESSMENT:\nAssessment pending.\n\n" +
                    "PLAN:\nPlan pending.";
        }
      } else {
        // If we can't parse the response, create a simple note with the transcript
        noteText = "SUBJECTIVE:\n" + transcript + "\n\n" +
                  "OBJECTIVE:\nSee transcript for details.\n\n" +
                  "ASSESSMENT:\nAssessment pending.\n\n" +
                  "PLAN:\nPlan pending.";
      }
      
      // Ensure the note has proper section headers
      if (!noteText.includes("SUBJECTIVE:")) {
        noteText = "SUBJECTIVE:\n" + noteText;
      }
      if (!noteText.includes("OBJECTIVE:")) {
        noteText += "\n\nOBJECTIVE:\nSee transcript for details.";
      }
      if (!noteText.includes("ASSESSMENT:")) {
        noteText += "\n\nASSESSMENT:\nAssessment pending.";
      }
      if (!noteText.includes("PLAN:")) {
        noteText += "\n\nPLAN:\nPlan pending.";
      }
      
      setGeneratedNote(noteText);
      
      // Parse the note text to extract sections
      const parsed = parseGeneratedNote(noteText);
      
      // Log the parsed note in debug mode
      if (debugMode) {
        console.log("Generated note:", noteText);
        console.log("Parsed note:", parsed);
      }
      
      setParsedNote(parsed);
      
      toast({ 
        variant: "default", 
        title: "Note generated successfully!",
        description: autoApply ? "Attempting to apply note to form..." : "Review and apply the note to the form."
      });
      
      // Open note preview
      setIsNotePreviewOpen(true);
      setProcessingStatus(null);
      
      // Don't auto-apply here - let the useEffect handle it
      
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
    if (!parsedNote) return;
    
    try {
      // Get current values to merge with new values
      const currentValues = getValues();
      
      if (debugMode) {
        console.log("Current form values:", currentValues);
        console.log("Parsed note to apply:", parsedNote);
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
      
      // Simple approach: update only one field at a time
      // Start with Subjective General Notes as it's most likely to exist
      if ('subjectiveGeneralNotes' in currentValues && parsedNote.subjective.generalNotes) {
        try {
          // Update the field
          setValue('subjectiveGeneralNotes', parsedNote.subjective.generalNotes, { 
            shouldDirty: true, 
            shouldValidate: true, 
            shouldTouch: true 
          });
          
          // Show success message
          toast({ 
            variant: "default", 
            title: "Note applied to form successfully!",
            description: "Updated Subjective General Notes"
          });
          
          return; // Exit after successful update
        } catch (error) {
          console.error("Error updating Subjective General Notes:", error);
          // Continue to next field
        }
      }
      
      // If Subjective General Notes failed, try Chief Complaint
      if ('subjectiveChiefComplaint' in currentValues && parsedNote.subjective.chiefComplaint) {
        try {
          // Update the field
          setValue('subjectiveChiefComplaint', parsedNote.subjective.chiefComplaint, { 
            shouldDirty: true, 
            shouldValidate: true, 
            shouldTouch: true 
          });
          
          // Show success message
          toast({ 
            variant: "default", 
            title: "Note applied to form successfully!",
            description: "Updated Chief Complaint"
          });
          
          return; // Exit after successful update
        } catch (error) {
          console.error("Error updating Chief Complaint:", error);
          // Continue to next field
        }
      }
      
      // If Chief Complaint failed, try Assessment
      if ('assessmentGeneralNotes' in currentValues && parsedNote.assessment.generalNotes) {
        try {
          // Update the field
          setValue('assessmentGeneralNotes', parsedNote.assessment.generalNotes, { 
            shouldDirty: true, 
            shouldValidate: true, 
            shouldTouch: true 
          });
          
          // Show success message
          toast({ 
            variant: "default", 
            title: "Note applied to form successfully!",
            description: "Updated Assessment"
          });
          
          return; // Exit after successful update
        } catch (error) {
          console.error("Error updating Assessment:", error);
          // Continue to next field
        }
      }
      
      // If all else fails, try to update any field that exists
      const fieldMappings = [
        { field: 'objectiveGeneralNotes', content: parsedNote.objective.generalNotes, label: 'Objective General Notes' },
        { field: 'objectivePhysicalExamNotes', content: parsedNote.objective.physicalExam, label: 'Physical Exam Notes' },
        { field: 'planGeneralNotes', content: parsedNote.plan.generalNotes, label: 'Plan' },
        { field: 'patientInstructionsGeneralNotes', content: parsedNote.patientInstructions.generalNotes, label: 'Patient Instructions' },
        { field: 'subjectiveHistoryOfPresentIllness', content: parsedNote.subjective.historyOfPresentIllness, label: 'History of Present Illness' },
        { field: 'subjectiveReviewOfSystems', content: parsedNote.subjective.reviewOfSystems, label: 'Review of Systems' }
      ];
      
      // Try each field in order
      for (const mapping of fieldMappings) {
        if (mapping.field in currentValues && mapping.content) {
          try {
            // Update the field
            setValue(mapping.field as any, mapping.content, { 
              shouldDirty: true, 
              shouldValidate: true, 
              shouldTouch: true 
            });
            
            // Show success message
            toast({ 
              variant: "default", 
              title: "Note applied to form successfully!",
              description: `Updated ${mapping.label}`
            });
            
            return; // Exit after successful update
          } catch (error) {
            console.error(`Error updating ${mapping.label}:`, error);
            // Continue to next field
          }
        }
      }
      
      // If we get here, we couldn't update any fields
      toast({ 
        variant: "default", // Changed from destructive to default to be less alarming
        title: "No fields updated",
        description: "Could not update any form fields. The note is still available in the preview."
      });
      
    } catch (error: any) {
      console.error("Error applying note to form:", error);
      
      // Check for the specific validation error
      if (error.message && error.message.includes("No fields were specified in the update request")) {
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
      
      toast({ variant: "default", title: "Recording transcribed successfully!" });
      setProcessingStatus("Transcription complete. Generating note...");
      
      // Auto-generate note if there's a transcript
      if (newTranscript) {
        await generateNote();
      }
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
    <div className="border rounded-md my-4 bg-gray-50">
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
        
          <Select
          value={selectedNoteType}
            onValueChange={setSelectedNoteType}
        >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select note type" />
            </SelectTrigger>
            <SelectContent>
          {NOTE_TYPES.map((nt) => (
                <SelectItem key={nt.value} value={nt.value}>
              {nt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-apply"
              checked={autoApply}
              onCheckedChange={setAutoApply}
            />
            <Label htmlFor="auto-apply">Auto-apply to form</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="debug-mode"
              checked={debugMode}
              onCheckedChange={setDebugMode}
            />
            <Label htmlFor="debug-mode">Debug Mode</Label>
          </div>
          
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
          onClick={generateNote}
          disabled={!transcript || uploading}
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
                <span>Generated Note Preview</span>
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