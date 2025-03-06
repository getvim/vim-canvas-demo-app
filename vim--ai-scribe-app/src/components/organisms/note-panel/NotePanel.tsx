import { useUpdateEncounter } from "@/vimOs/useUpdateEncounter";
import { SoapSection } from "../../molecules/SoapSection";
import type {
  SectionTypes,
  TranscriptionSegment,
} from "../ai-scribe-demo/transcription.mock";

interface NotePanelProps {
  note: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  hoveredSegment: number | null;
  transcriptionSegments: TranscriptionSegment[];
  renderHighlightedText: (text: string) => JSX.Element;
}

// const ENCOUNTER_PRIORITY = {
//   subjective: [""],
// } satisfies Record<string, string[]>;

// const calcFieldByPriority = () => {
//   const priority = ENCOUNTER_PRIORITY[subjective];
//   const object = {
//     subjective: {
//       first: false,
//       second: false,
//       third: true,
//       fourth: true
//     }

//     for (field in pri)
//   }
// };

const useUpdateSubjective = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();

  const updateSubjectiveNote = (content: string) => {
    const updateOptions = checkCanUpdate({
      subjective: { generalNotes: true },
    });
    const { canUpdate: canUpdateResult } = updateOptions;

    if (canUpdateResult) {
      updateEncounter({
        subjective: {
          generalNotes: content,
        },
      });
    }
  };

  return { updateSubjectiveNote };
};

const useUpdateObjective = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();

  const updateObjectiveNote = (content: string) => {
    const updateOptions = checkCanUpdate({
      objective: { generalNotes: true },
    });
    const { canUpdate } = updateOptions;

    if (canUpdate) {
      updateEncounter({
        objective: {
          generalNotes: content,
        },
      });
    }
  };

  return { updateObjectiveNote };
};

const useUpdateAssessment = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();

  const updateAssessmentNote = (content: string) => {
    const updateOptions = checkCanUpdate({
      assessment: { generalNotes: true },
    });
    const { canUpdate: canUpdateResult } = updateOptions;

    if (canUpdateResult) {
      updateEncounter({
        assessment: {
          generalNotes: content,
        },
      });
    }
  };

  return { updateAssessmentNote };
};

const useUpdatePlan = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();

  const updatePlanNote = (content: string) => {
    const updateOptions = checkCanUpdate({
      plan: { generalNotes: true },
    });
    const { canUpdate: canUpdateResult } = updateOptions;

    if (canUpdateResult) {
      updateEncounter({
        plan: {
          generalNotes: content,
        },
      });
    }
  };

  return { updatePlanNote };
};

export const NotePanel = ({
  note,
  hoveredSegment,
  transcriptionSegments,
  renderHighlightedText,
}: NotePanelProps) => {
  const { updateSubjectiveNote } = useUpdateSubjective();
  const { updateObjectiveNote } = useUpdateObjective();
  const { updateAssessmentNote } = useUpdateAssessment();
  const { updatePlanNote } = useUpdatePlan();

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
        isHighlighted={isHighlighted("subjective")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateSubjectiveNote(note.subjective)}
      />
      <SoapSection
        title="Objective"
        content={note.objective}
        isHighlighted={isHighlighted("objective")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateObjectiveNote(note.objective)}
      />
      <SoapSection
        title="Assessment"
        content={note.assessment}
        isHighlighted={isHighlighted("assessment")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateAssessmentNote(note.assessment)}
      />
      <SoapSection
        title="Plan"
        content={note.plan}
        isHighlighted={isHighlighted("plan")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updatePlanNote(note.plan)}
      />
    </div>
  );
};
