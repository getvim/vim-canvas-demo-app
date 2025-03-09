import { useState } from "react";
import { useNoteFormContext } from "@/providers/NoteFormContext";
import { useVimOsContext } from "@/providers/VimOSContext";
import { Button } from "../../atoms/Button";
import { DebugView } from "../../templates/DebugView";
import { MOCK_TRANSCRIPTION } from "../ai-scribe-demo/transcription.mock";
import { NotesSections } from "./NotesSections";

export const NotesTab = ({
  patientName,
  handleFullEhrUpdate,
  renderHighlightedText,
}: {
  patientName: string;
  handleFullEhrUpdate: () => Promise<void>;
  renderHighlightedText: (text: string) => JSX.Element;
}) => {
  const vimOS = useVimOsContext();
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const { watch } = useNoteFormContext();
  const currentNote = watch();

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
    vimOS.hub.setDynamicAppSize(isDebugMode ? "CLASSIC" : "LARGE");
  };

  return (
    <>
      <div className="flex flex-col justify-between items-center gap-2">
        <h2 className="text-3xl font-bold text-gray-800">
          {patientName || "Patient Name"}
        </h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={toggleDebugMode}
            variant={isDebugMode ? "primary" : "ghost"}
            className={isDebugMode ? "bg-purple-500 hover:bg-purple-600" : ""}
          >
            Transcription
          </Button>
          <Button onClick={() => handleFullEhrUpdate()}>Push all to EHR</Button>
        </div>
        <div className="text-sm text-gray-500">Note saved automatically</div>
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
          hoveredSegment={hoveredSegment}
          transcriptionSegments={MOCK_TRANSCRIPTION}
          renderHighlightedText={renderHighlightedText}
        />
      )}
    </>
  );
};
