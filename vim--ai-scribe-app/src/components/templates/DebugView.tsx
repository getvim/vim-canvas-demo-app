import { TranscriptionPanel } from "../organisms/TranscriptionPanel";
import { NotePanel } from "../organisms/NotePanel";
import type { TranscriptionSegment } from "../ai-scribe/transcription.mock";

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
  onPushToEHR: () => void;
  renderHighlightedText: (text: string) => JSX.Element;
}

export function DebugView({
  transcriptionSegments,
  hoveredSegment,
  onHoverSegment,
  currentNote,
  onPushToEHR,
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
        onPushToEHR={onPushToEHR}
        renderHighlightedText={renderHighlightedText}
      />
    </div>
  );
}
