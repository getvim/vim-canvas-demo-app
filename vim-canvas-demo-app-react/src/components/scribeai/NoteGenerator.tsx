import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FormInputs } from "../encounter-content/form";
import { useFormContext } from "react-hook-form";

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
    diagnoses?: string[];
  };
  plan: {
    generalNotes?: string;
    procedures?: string[];
  };
  patientInstructions: {
    generalNotes?: string;
  };
}

export const NoteGenerator = () => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState("");
  const [selectedNoteType, setSelectedNoteType] = useState("soap");
  const [uploading, setUploading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState("");
  const [parsedNote, setParsedNote] = useState<ParsedNote | null>(null);
  const [customNotes, setCustomNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  // Try to get form context - will be available if component is used within the encounter form
  let formContext: ReturnType<typeof useFormContext<FormInputs>> | null = null;
  try {
    formContext = useFormContext<FormInputs>();
  } catch (e) {
    // Form context not available, component is being used standalone
  }

  // Parse the generated note into sections
  const parseGeneratedNote = (note: string): ParsedNote => {
    const parsed: ParsedNote = {
      subjective: {},
      objective: {},
      assessment: {},
      plan: {},
      patientInstructions: {}
    };
    
    // Simple parsing based on section headers
    const sections = note.split(/\n(?=[A-Z]+:)/);
    
    for (const section of sections) {
      if (section.startsWith("SUBJECTIVE:") || section.includes("\nSUBJECTIVE:")) {
        const content = section.replace(/.*SUBJECTIVE:\s*/s, "").trim();
        
        // Try to extract chief complaint
        const ccMatch = content.match(/Chief Complaint:([^\n]+)/i);
        if (ccMatch) {
          parsed.subjective.chiefComplaint = ccMatch[1].trim();
        }
        
        // Try to extract HPI
        const hpiMatch = content.match(/History of Present Illness:([^]*?)(?=\n[A-Z][a-z]+:|$)/i);
        if (hpiMatch) {
          parsed.subjective.historyOfPresentIllness = hpiMatch[1].trim();
        }
        
        // Try to extract ROS
        const rosMatch = content.match(/Review of Systems:([^]*?)(?=\n[A-Z][a-z]+:|$)/i);
        if (rosMatch) {
          parsed.subjective.reviewOfSystems = rosMatch[1].trim();
        }
        
        // Set general notes if specific sections weren't found
        if (!parsed.subjective.chiefComplaint && !parsed.subjective.historyOfPresentIllness && !parsed.subjective.reviewOfSystems) {
          parsed.subjective.generalNotes = content;
        }
      } 
      else if (section.startsWith("OBJECTIVE:") || section.includes("\nOBJECTIVE:")) {
        const content = section.replace(/.*OBJECTIVE:\s*/s, "").trim();
        
        // Try to extract physical exam
        const peMatch = content.match(/Physical Examination:([^]*?)(?=\n[A-Z][a-z]+:|$)/i);
        if (peMatch) {
          parsed.objective.physicalExam = peMatch[1].trim();
        }
        
        // Set general notes
        parsed.objective.generalNotes = peMatch ? content.replace(/Physical Examination:([^]*?)(?=\n[A-Z][a-z]+:|$)/i, "").trim() : content;
      } 
      else if (section.startsWith("ASSESSMENT:") || section.includes("\nASSESSMENT:")) {
        const content = section.replace(/.*ASSESSMENT:\s*/s, "").trim();
        
        // Try to extract diagnoses
        const diagnosesMatch = content.match(/Diagnoses:([^]*?)(?=\n[A-Z][a-z]+:|$)/i);
        if (diagnosesMatch) {
          const diagnosesText = diagnosesMatch[1].trim();
          parsed.assessment.diagnoses = diagnosesText.split(/\n/).map(d => d.trim()).filter(d => d);
        }
        
        parsed.assessment.generalNotes = content;
      } 
      else if (section.startsWith("PLAN:") || section.includes("\nPLAN:")) {
        const content = section.replace(/.*PLAN:\s*/s, "").trim();
        
        // Try to extract procedures
        const proceduresMatch = content.match(/Procedures:([^]*?)(?=\n[A-Z][a-z]+:|$)/i);
        if (proceduresMatch) {
          const proceduresText = proceduresMatch[1].trim();
          parsed.plan.procedures = proceduresText.split(/\n/).map(p => p.trim()).filter(p => p);
        }
        
        parsed.plan.generalNotes = content;
      } 
      else if (section.startsWith("PATIENT INSTRUCTIONS:") || section.includes("\nPATIENT INSTRUCTIONS:")) {
        parsed.patientInstructions.generalNotes = section.replace(/.*PATIENT INSTRUCTIONS:\s*/s, "").trim();
      }
    }
    
    return parsed;
  };

  // Apply the parsed note to the form
  const applyParsedNote = () => {
    if (!parsedNote || !formContext) {
      toast({ 
        variant: "destructive", 
        title: "Cannot apply note", 
        description: "Either no note is generated or the form context is not available." 
      });
      return;
    }
    
    const { setValue } = formContext;
    
    // Set values in the form
    if (parsedNote.subjective.generalNotes) {
      setValue("subjectiveGeneralNotes", parsedNote.subjective.generalNotes, { shouldDirty: true });
    }
    
    if (parsedNote.subjective.chiefComplaint) {
      setValue("subjectiveChiefComplaint", parsedNote.subjective.chiefComplaint, { shouldDirty: true });
    }
    
    if (parsedNote.subjective.historyOfPresentIllness) {
      setValue("subjectiveHistoryOfPresentIllness", parsedNote.subjective.historyOfPresentIllness, { shouldDirty: true });
    }
    
    if (parsedNote.subjective.reviewOfSystems) {
      setValue("subjectiveReviewOfSystems", parsedNote.subjective.reviewOfSystems, { shouldDirty: true });
    }
    
    if (parsedNote.objective.generalNotes) {
      setValue("objectiveGeneralNotes", parsedNote.objective.generalNotes, { shouldDirty: true });
    }
    
    if (parsedNote.objective.physicalExam) {
      setValue("objectivePhysicalExamNotes", parsedNote.objective.physicalExam, { shouldDirty: true });
    }
    
    if (parsedNote.assessment.generalNotes) {
      setValue("assessmentGeneralNotes", parsedNote.assessment.generalNotes, { shouldDirty: true });
    }
    
    if (parsedNote.plan.generalNotes) {
      setValue("planGeneralNotes", parsedNote.plan.generalNotes, { shouldDirty: true });
    }
    
    if (parsedNote.patientInstructions.generalNotes) {
      setValue("patientInstructionsGeneralNotes", parsedNote.patientInstructions.generalNotes, { shouldDirty: true });
    }
    
    toast({ 
      variant: "default", 
      title: "Note applied", 
      description: "The generated note has been applied to the form fields." 
    });
  };

  // Handle audio file upload transcription
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const jwtToken = SCRIBEAI_API_KEY;
      
      const formData = new FormData();
      formData.append("audioFile", file);

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
      let newTranscript = data.transcript || data.transcriptText || "";
      
      // Append the new transcript to the existing one with proper formatting
      setTranscript(prevTranscript => {
        if (!prevTranscript) return newTranscript;
        return `${prevTranscript}\n\n--- New Transcription ---\n${newTranscript}`;
      });
      
      toast({ variant: "default", title: "File transcription successful!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error with file transcription", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  // Handle recording and automatic upload
  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false); // Set this first to prevent multiple clicks
      toast({ variant: "default", title: "Stopping recording..." });
      
      if (mediaRecorderRef.current) {
        try {
          // Stop the media recorder
          mediaRecorderRef.current.stop();
          // We'll let the onstop handler handle the rest
        } catch (error) {
          console.error("Error stopping recording:", error);
          toast({ 
            variant: "destructive", 
            title: "Error stopping recording", 
            description: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      }
    } else {
      try {
        // Clear previous recording data
        recordedChunksRef.current = []; // Clear the ref
        
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
        
        // Collect audio chunks - store in ref directly
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            console.log("Received audio chunk of size:", e.data.size);
            recordedChunksRef.current.push(e.data);
          }
        };
        
        // When recording stops, upload the audio
        mediaRecorder.onstop = async () => {
          console.log("MediaRecorder stopped, processing chunks...");
          
          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
          
          // Use the ref instead of state
          const currentChunks = [...recordedChunksRef.current];
          console.log(`Processing ${currentChunks.length} audio chunks`);
          
          if (currentChunks.length === 0) {
            toast({ 
              variant: "destructive", 
              title: "Recording error", 
              description: "No audio data was captured. Please try again." 
            });
            return;
          }
          
          try {
            // Combine chunks into a single blob
            const audioBlob = new Blob(currentChunks, { 
              type: mediaRecorder.mimeType || 'audio/webm' 
            });
            
            console.log("Recording completed, blob size:", audioBlob.size, "type:", audioBlob.type);
            
            if (audioBlob.size < 100) {
              toast({ 
                variant: "destructive", 
                title: "Recording too short", 
                description: "The recording was too short to process. Please try again." 
              });
              return;
            }
            
            // Try to use a more compatible format if possible
            let fileType = 'webm';
            let mimeType = mediaRecorder.mimeType || 'audio/webm';
            
            if (mimeType.includes('ogg')) {
              fileType = 'ogg';
            } else if (mimeType.includes('mp4') || mimeType.includes('mp4a')) {
              fileType = 'mp4';
            }
            
            // Create a File object from the Blob with a more descriptive name
            const audioFile = new File(
              [audioBlob], 
              `recording-${new Date().toISOString().replace(/[:.]/g, '-')}.${fileType}`, 
              { type: mimeType }
            );
            
            // Upload the file using the existing upload function
            await uploadAudioFile(audioFile);
          } catch (error) {
            console.error("Error processing recording:", error);
            toast({
              variant: "destructive",
              title: "Error processing recording",
              description: error instanceof Error ? error.message : "Unknown error"
            });
          }
        };
        
        // Start recording with smaller chunks for more frequent updates
        mediaRecorder.start(500);
        setIsRecording(true);
        toast({ variant: "default", title: "Recording started" });
      } catch (error: any) {
        console.error("Error starting recording:", error);
        toast({ 
          variant: "destructive", 
          title: "Error starting recording", 
          description: error.message 
        });
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

      toast({ variant: "default", title: "Uploading and transcribing recording..." });
      
      // Log the file details for debugging
      console.log("Uploading file:", file.name, file.type, file.size);
      
      const response = await fetch(`${API_BASE_URL}/api/transcribe-file`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Transcription error response:", errorDetail);
        throw new Error(`File transcription failed: ${errorDetail}`);
      }
      
      const data = await response.json();
      console.log("Transcription response:", data);
      
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
    } catch (error: any) {
      console.error("Transcription error:", error);
      toast({ 
        variant: "destructive", 
        title: "Error transcribing recording", 
        description: error.message 
      });
    } finally {
      setUploading(false);
    }
  };

  // Generate note using the selected ScribeAI endpoint
  const generateNote = async () => {
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
      
      console.log("Posting note to:", endpoint);
      
      // Based on the HAR file, the API expects this structure
      const payload = {
        transcriptText: transcript,
        patientInfo: {
          name: "", // These can be populated from VIM if available
          dob: "",
          chiefComplaint: "",
          visitDate: new Date().toISOString().split('T')[0],
          weight: null
        },
        customNotes,
        selectedICDCodes: [],
        selectedCPTCodes: [],
        suggestedICDCodes: [],
        suggestedCPTCodes: []
      };
      
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
      const noteText = data.note || JSON.stringify(data, null, 2);
      setGeneratedNote(noteText);
      
      // Parse the generated note
      const parsed = parseGeneratedNote(noteText);
      setParsedNote(parsed);
      
      toast({ variant: "default", title: "Note generated successfully!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error generating note", description: error.message });
    }
  };

  return (
    <div className="p-4 border rounded-md my-4">
      <h3 className="font-bold mb-2">ScribeAI Note Generator</h3>
      
      <div className="mb-2">
        <label className="block mb-1">Select Note Type</label>
        <select
          value={selectedNoteType}
          onChange={(e) => setSelectedNoteType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {NOTE_TYPES.map((nt) => (
            <option key={nt.value} value={nt.value}>
              {nt.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-2">
        <label className="block mb-1">Upload Audio File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          disabled={uploading || isRecording}
          className="p-2 border rounded w-full"
        />
        {uploading && <p className="text-sm text-gray-500">Uploading and transcribing...</p>}
      </div>
      
      <div className="mb-2">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={handleRecording}
            variant={isRecording ? "destructive" : "default"}
            disabled={uploading}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
        {isRecording && <p className="text-sm text-red-500 mt-1">Recording in progress...</p>}
      </div>
      
      <div className="mb-2">
        <label className="block mb-1">Custom Notes</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Enter any additional notes or context..."
        />
      </div>
      
      <div className="mb-2">
        <label className="block mb-1">Transcript</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={6}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Transcript will appear here or type notes manually..."
        />
      </div>
      
      <div className="mb-4 flex space-x-2">
        <Button variant="default" onClick={generateNote}>
          Generate Note
        </Button>
        
        {formContext && parsedNote && (
          <Button variant="outline" onClick={applyParsedNote}>
            Apply to Encounter Form
          </Button>
        )}
      </div>
      
      {/* Display the generated note */}
      {generatedNote && (
        <div className="p-4 border rounded-md mt-4 bg-gray-50">
          <h4 className="mb-2 font-medium">Generated Note:</h4>
          <pre className="whitespace-pre-wrap">{generatedNote}</pre>
        </div>
      )}
      
      {/* Display parsed sections preview */}
      {parsedNote && (
        <div className="p-4 border rounded-md mt-4 bg-blue-50">
          <h4 className="mb-2 font-medium">Parsed Sections (Preview):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium">Subjective</h5>
              {parsedNote.subjective.chiefComplaint && (
                <div className="mb-2">
                  <span className="font-medium">Chief Complaint:</span> 
                  <p className="text-sm">{parsedNote.subjective.chiefComplaint}</p>
                </div>
              )}
              {parsedNote.subjective.historyOfPresentIllness && (
                <div className="mb-2">
                  <span className="font-medium">HPI:</span>
                  <p className="text-sm">{parsedNote.subjective.historyOfPresentIllness.substring(0, 100)}...</p>
                </div>
              )}
            </div>
            <div>
              <h5 className="font-medium">Objective</h5>
              {parsedNote.objective.physicalExam && (
                <div className="mb-2">
                  <span className="font-medium">Physical Exam:</span>
                  <p className="text-sm">{parsedNote.objective.physicalExam.substring(0, 100)}...</p>
                </div>
              )}
            </div>
            <div>
              <h5 className="font-medium">Assessment</h5>
              {parsedNote.assessment.generalNotes && (
                <p className="text-sm">{parsedNote.assessment.generalNotes.substring(0, 100)}...</p>
              )}
            </div>
            <div>
              <h5 className="font-medium">Plan</h5>
              {parsedNote.plan.generalNotes && (
                <p className="text-sm">{parsedNote.plan.generalNotes.substring(0, 100)}...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 