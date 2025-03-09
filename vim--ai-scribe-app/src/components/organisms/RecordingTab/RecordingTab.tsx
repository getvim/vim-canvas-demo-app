import { type Dispatch, type SetStateAction } from "react";
import { User, Mic } from "lucide-react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { useVimOsContext } from "@/providers/VimOSContext";
import { buildName } from "../ai-scribe-demo/buildName";

export const RecordingTab = ({
  patientName,
  setPatientName,
  simulateRecording,
}: {
  patientName: string;
  setPatientName: Dispatch<SetStateAction<string>>;
  simulateRecording: () => void;
}) => {
  const vimOS = useVimOsContext();
  const username = buildName(vimOS) || ""

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between">
        <div>{username}</div>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Start New Recording
          </h2>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        <Input
          value={patientName}
          onChange={setPatientName}
          placeholder="Enter patient name"
        />

        <Button
          onClick={simulateRecording}
          disabled={!patientName.trim()}
          fullWidth
          className="mt-4 py-4"
        >
          <Mic className="h-5 w-5 mr-2" />
          Start Recording
        </Button>
      </div>
    </div>
  );
};
