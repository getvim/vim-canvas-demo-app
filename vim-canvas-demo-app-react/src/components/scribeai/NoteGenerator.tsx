import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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

export const NoteGenerator = () => {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState("");
  const [selectedNoteType, setSelectedNoteType] = useState("soap");
  const [uploading, setUploading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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
      
      // Check both possible response formats based on the API
      if (data.transcript) {
        setTranscript(data.transcript);
      } else if (data.transcriptText) {
        setTranscript(data.transcriptText);
      } else {
        console.warn("No transcript found in response:", data);
        setTranscript("Transcription completed but no text was returned.");
      }
      
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
      setGeneratedNote(data.note || JSON.stringify(data, null, 2));
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