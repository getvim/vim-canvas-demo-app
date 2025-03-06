import { useState } from "react";
import { Bug } from "lucide-react";
import { Button } from "../../atoms/Button";
import { NotesSections } from "./NotesSections";
import { DebugView } from "../../templates/DebugView";
import { MOCK_TRANSCRIPTION } from "../ai-scribe-demo/transcription.mock";

export const NotesTab = ({
  patientName,
  handleFullEhrUpdate,
  currentNote,
  renderHighlightedText,
}: {
  patientName: string;
  handleFullEhrUpdate: () => Promise<void>;
  currentNote: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  renderHighlightedText: (text: string) => JSX.Element;
}) => {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          {patientName || "Patient Name"}
        </h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsDebugMode(!isDebugMode)}
            variant={isDebugMode ? "primary" : "ghost"}
            className={isDebugMode ? "bg-purple-500 hover:bg-purple-600" : ""}
          >
            <Bug className="h-4 w-4 mr-2" />
            Debug Mode
          </Button>
          <div className="text-sm text-gray-500">Note saved automatically</div>
          <Button onClick={() => handleFullEhrUpdate()}>
            {/* TODO */}
            Push all to EHR
          </Button>
        </div>
      </div>

      {isDebugMode ? (
        <DebugView
          transcriptionSegments={MOCK_TRANSCRIPTION}
          hoveredSegment={hoveredSegment}
          onHoverSegment={setHoveredSegment}
          currentNote={currentNote}
          renderHighlightedText={renderHighlightedText}
        />
      ) : (
        <NotesSections
          note={currentNote}
          hoveredSegment={hoveredSegment}
          transcriptionSegments={MOCK_TRANSCRIPTION}
          renderHighlightedText={renderHighlightedText}
        />
      )}
    </>
  );
};
