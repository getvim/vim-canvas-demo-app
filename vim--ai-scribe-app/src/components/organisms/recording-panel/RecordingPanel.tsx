import { Play, Pause } from "lucide-react";
import { formatTime } from "@/utils/formatTime.util";
import { Button } from "../../atoms/Button";

interface RecordingPanelProps {
  isPaused: boolean;
  recordingTime: number;
  onPausePlay: () => void;
  onEndVisit: () => void;
}

export const RecordingPanel = ({
  isPaused,
  recordingTime,
  onPausePlay,
  onEndVisit,
}: RecordingPanelProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="flex flex-col items-center space-y-8">
        <button
          onClick={onPausePlay}
          className="w-48 h-48 rounded-full bg-black shadow-lg flex items-center justify-center hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {isPaused ? (
            <Play className="h-12 w-12 text-green-500" />
          ) : (
            <Pause className="h-12 w-12 text-green-500" />
          )}
        </button>
        <div className="text-2xl font-semibold text-green-800 whitespace-nowrap">
          {isPaused ? "Paused: " : "Recording: "}
          {formatTime(recordingTime)}
        </div>
      </div>

      <div className="text-center space-y-2 mt-8">
        <p className="text-gray-600">You can close the app and multitask</p>
        <p className="text-green-800 font-medium">
          We will keep recording until you click "End visit".
        </p>
      </div>

      <Button onClick={onEndVisit} fullWidth className="max-w-sm py-4">
        End visit
      </Button>

      <a
        href="#"
        className="text-green-600 hover:text-green-800 underline mt-4"
      >
        How do I tell my patient about AI Scribe?
      </a>
    </div>
  );
};
