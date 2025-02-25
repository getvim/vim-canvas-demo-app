import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";

// Import your provided ScribeAI API key from the environment
const SCRIBEAI_API_KEY = import.meta.env.VITE_SCRIBEAI_API_KEY as string;

// Define the production API base URL so that all endpoints are absolute
const API_BASE_URL = "https://api-unique-stg-1048c00a084a.herokuapp.com";

const NOTE_TYPES = [
  { value: "soap", label: "SOAP Note" },
  { value: "progress", label: "Progress Note" },
  { value: "diagnostic", label: "Diagnostic Note" },
  { value: "psych", label: "Psychological Note" },
];

export const NoteGenerator = () => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState("");
  const [selectedNoteType, setSelectedNoteType] = useState("soap");
  const [isLive, setIsLive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  // ... removed state variables for patient info ...
  const [customNotes, setCustomNotes] = useState("");

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
        throw new Error("File transcription failed");
      }
      const data = await response.json();
      setTranscript(data.transcriptText || "");
      toast({ variant: "default", title: "File transcription successful!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error with file transcription", description: error.message });
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
      
      const payload = {
        transcriptText: transcript,
        customNotes: customNotes,
        selectedICDCodes: [],
        selectedCPTCodes: [],
        suggestedICDCodes: [],
        suggestedCPTCodes: []
      };
       
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("ScribeAI note generation failed");
      }
      const data = await response.json();
      toast({
        variant: "default",
        title: "Generated note",
        description: data.generatedNote || "Note generated successfully",
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error generating note", description: error.message });
    }
  };

  // ... rest of the component code remains unchanged ...
  
  return (
    // ... component JSX ...
  );
}; 