import { SoapSection } from "../molecules/SoapSection";
import type {
  SectionTypes,
  TranscriptionSegment,
} from "./ai-scribe-demo/transcription.mock";

interface NotePanelProps {
  note: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  hoveredSegment: number | null;
  transcriptionSegments: TranscriptionSegment[];
  onPushToEHR: () => void;
  renderHighlightedText: (text: string) => JSX.Element;
}

export const NotePanel = ({
  note,
  hoveredSegment,
  transcriptionSegments,
  onPushToEHR,
  renderHighlightedText,
}: NotePanelProps) => {
  const isHighlighted = (section: SectionTypes) => {
    if (hoveredSegment === null) return false;
    return transcriptionSegments[hoveredSegment].affectedSections.includes(
      section
    );
  };

  return (
    <div className="space-y-4">
      <SoapSection
        title="Subjective"
        content={note.subjective}
        onPushToEHR={onPushToEHR}
        isHighlighted={isHighlighted("subjective")}
        renderHighlightedText={renderHighlightedText}
      />
      <SoapSection
        title="Objective"
        content={note.objective}
        onPushToEHR={onPushToEHR}
        isHighlighted={isHighlighted("objective")}
        renderHighlightedText={renderHighlightedText}
      />
      <SoapSection
        title="Assessment"
        content={note.assessment}
        onPushToEHR={onPushToEHR}
        isHighlighted={isHighlighted("assessment")}
        renderHighlightedText={renderHighlightedText}
      />
      <SoapSection
        title="Plan"
        content={note.plan}
        onPushToEHR={onPushToEHR}
        isHighlighted={isHighlighted("plan")}
        renderHighlightedText={renderHighlightedText}
      />
    </div>
  );
};
