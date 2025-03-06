import { TranscriptionPanel } from "../organisms/transcription-panel/TranscriptionPanel";
import { NotePanel } from "../organisms/note-panel/NotePanel";
import type { TranscriptionSegment } from "../organisms/ai-scribe-demo/transcription.mock";

interface DebugViewProps {
  transcriptionSegments: TranscriptionSegment[];
  hoveredSegment: number | null;
  onHoverSegment: (index: number | null) => void;
  currentNote: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  renderHighlightedText: (text: string) => JSX.Element;
}

export function DebugView({
  transcriptionSegments,
  hoveredSegment,
  onHoverSegment,
  currentNote,
  renderHighlightedText,
}: DebugViewProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <TranscriptionPanel
        segments={transcriptionSegments}
        hoveredSegment={hoveredSegment}
        onHoverSegment={onHoverSegment}
      />
      <NotePanel
        note={currentNote}
        hoveredSegment={hoveredSegment}
        transcriptionSegments={transcriptionSegments}
        renderHighlightedText={renderHighlightedText}
      />
    </div>
  );
}
