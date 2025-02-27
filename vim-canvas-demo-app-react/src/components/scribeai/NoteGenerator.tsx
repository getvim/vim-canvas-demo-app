import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Import your provided ScribeAI API key from the environment
const SCRIBEAI_API_KEY = import.meta.env.VITE_SCRIBEAI_API_KEY as string;

// Import the production API base URL so that all endpoints are absolute
const API_BASE_URL = "https://api-devs-8a32c93f7e2d.herokuapp.com";

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
  const [generatedNote, setGeneratedNote] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
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
        const errorDetail = await response.text();
        throw new Error(`File transcription failed: ${errorDetail}`);
      }
      const data = await response.json();
      // From the HAR file, we can see the response has a "transcript" field
      setTranscript(data.transcript || "");
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
      const ws = new WebSocket(`${API_BASE_URL.replace('https://', 'wss://')}/api/live?token=${jwtToken}`);
      wsRef.current = ws;
      ws.onopen = () => {
        toast({ variant: "default", title: "Live transcription started!" });
        setIsLive(true);
      };
      ws.onmessage = (event) => {
        // Append partial transcript received via the WebSocket
        setTranscript(prev => prev + " " + event.data);
      };
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({ variant: "destructive", title: "Live transcription error" });
      };
      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        toast({ 
          variant: "default", 
          title: "Live transcription ended",
          description: event.reason ? `Reason: ${event.reason}` : undefined
        });
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
          visitDate: new Date().toISOString().split('T')[0], // Today's date
          weight: null
        },
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
        // Try to extract error details from the server response
        const errorDetail = await response.text();
        throw new Error(`ScribeAI note generation failed: ${errorDetail}`);
      }
      const data = await response.json();
      // From the HAR file, we can see the response has a "content" field
      setGeneratedNote(data.content || "");
      toast({
        variant: "default",
        title: "Generated note",
        description: "Note generated successfully",
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
        {uploading && <p className="text-sm text-gray-500">Uploading and transcribing...</p>}
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
        <label className="block mb-1">Transcript / Typed Notes</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={6}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Transcript will appear here or type notes manually..."
        />
      </div>
      
      <div className="mb-4">
        <Button variant="default" onClick={generateNote}>
          Generate Note
        </Button>
      </div>
      
      {/* Display the generated note */}
      {generatedNote && (
        <div className="p-4 border rounded-md mt-4 bg-gray-50">
          <h4 className="mb-2 font-medium">Generated Note:</h4>
          <pre className="whitespace-pre-wrap">{generatedNote}</pre>
        </div>
      )}
    </div>
  );
}; 