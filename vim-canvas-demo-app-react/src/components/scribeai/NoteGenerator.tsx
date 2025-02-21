import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Import your provided ScribeAI API key from the environment
const SCRIBEAI_API_KEY = import.meta.env.VITE_SCRIBEAI_API_KEY as string;

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

  // Handle audio file upload transcription
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Instead of fetching the token from the VimOS context,
      // use your provided ScribeAI API key.
      const jwtToken = SCRIBEAI_API_KEY;
      
      const formData = new FormData();
      formData.append("audioFile", file);

      const response = await fetch(
        "https://api-unique-stg-1048c00a084a.herokuapp.com/api/transcribe-file", {
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
      // Assuming the API returns a field "transcriptText"
      setTranscript(data.transcriptText || "");
      toast({ variant: "default", title: "File transcription successful!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error with file transcription", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  // Start live transcription using WebSocket
  const startLiveTranscription = async () => {
    try {
      const jwtToken = SCRIBEAI_API_KEY;
      
      // Since you cannot set custom headers, we pass the token as a query parameter.
      const ws = new WebSocket(`wss://api-unique-stg-1048c00a084a.herokuapp.com/api/live?token=${jwtToken}`);
      wsRef.current = ws;
      ws.onopen = () => {
        toast({ variant: "default", title: "Live transcription started!" });
        setIsLive(true);
      };
      ws.onmessage = (event) => {
        // Append partial transcript received via the WebSocket
        setTranscript(prev => prev + " " + event.data);
      };
      ws.onerror = () => {
        toast({ variant: "destructive", title: "Live transcription error" });
      };
      ws.onclose = () => {
        toast({ variant: "default", title: "Live transcription ended" });
        setIsLive(false);
      };
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error starting live transcription", description: error.message });
    }
  };

  // Stop live transcription
  const stopLiveTranscription = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsLive(false);
    }
  };

  // Generate note using the selected ScribeAI endpoint
  const generateNote = async () => {
    try {
      const jwtToken = SCRIBEAI_API_KEY;
      
      let endpoint = "";
      switch (selectedNoteType) {
        case "soap":
          endpoint = "https://api-unique-stg-1048c00a084a.herokuapp.com/api/notes/soap";
          break;
        case "progress":
          endpoint = "https://api-unique-stg-1048c00a084a.herokuapp.com/api/notes/progress";
          break;
        case "diagnostic":
          endpoint = "https://api-unique-stg-1048c00a084a.herokuapp.com/api/notes/diagnostic";
          break;
        case "psych":
          endpoint = "https://api-unique-stg-1048c00a084a.herokuapp.com/api/notes/psych";
          break;
        default:
          throw new Error("Invalid note type");
      }
      // Payload with transcript and placeholder patientInfo (replace with real data as needed)
      const payload = {
        transcriptText: transcript,
        patientInfo: {
          name: "Patient Name",
          dob: "1970-01-01",
          chiefComplaint: "Chief Complaint",
          visitDate: new Date().toISOString().split("T")[0],
          weight: 0,
        },
        customNotes: "",
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
      // Assume the API returns the generated note in "generatedNote"
      toast({
        variant: "default",
        title: "Generated note",
        description: data.generatedNote || "Note generated successfully",
      });
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
          disabled={uploading}
          className="p-2 border rounded w-full"
        />
      </div>
      
      <div className="mb-2">
        <div className="flex space-x-2">
          {!isLive ? (
            <Button size="sm" onClick={startLiveTranscription}>
              Start Live Transcription
            </Button>
          ) : (
            <Button size="sm" onClick={stopLiveTranscription}>
              Stop Live Transcription
            </Button>
          )}
        </div>
      </div>
      
      <div className="mb-2">
        <label className="block mb-1">Transcript / Typed Notes</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={6}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </div>
      
      <div>
        <Button variant="default" onClick={generateNote}>
          Generate Note
        </Button>
      </div>
    </div>
  );
}; 