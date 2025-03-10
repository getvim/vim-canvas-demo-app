import { useUpdateEncounter } from "@/vimOs/useUpdateEncounter";
import { SoapSection } from "../../molecules/SoapSection";
import type {
  SectionTypes,
  TranscriptionSegment,
} from "../ai-scribe-demo/transcription.mock";
import { useNoteFormContext } from "@/providers/NoteFormContext";

interface NotePanelProps {
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
  const { watch } = useNoteFormContext();

  const updateSubjectiveNote = () => {
    const updateOptions = checkCanUpdate({
      subjective: { generalNotes: true },
    });
    const { canUpdate: canUpdateResult } = updateOptions;

    if (canUpdateResult) {
      const formValues = watch();

      updateEncounter({
        subjective: {
          generalNotes: formValues.subjective,
        },
      });
    }
  };

  return { updateSubjectiveNote };
};

const useUpdateObjective = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();
  const { watch } = useNoteFormContext();

  const updateObjectiveNote = () => {
    const updateOptions = checkCanUpdate({
      objective: { generalNotes: true },
    });
    const { canUpdate } = updateOptions;

    if (canUpdate) {
      const formValues = watch();

      updateEncounter({
        objective: {
          generalNotes: formValues.objective,
        },
      });
    }
  };

  return { updateObjectiveNote };
};

const useUpdateAssessment = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();
  const { watch } = useNoteFormContext();

  const updateAssessmentNote = () => {
    const updateOptions = checkCanUpdate({
      assessment: { generalNotes: true },
    });
    const { canUpdate: canUpdateResult } = updateOptions;

    if (canUpdateResult) {
      const formValues = watch();

      updateEncounter({
        assessment: {
          generalNotes: formValues.assessment,
        },
      });
    }
  };

  return { updateAssessmentNote };
};

const useUpdatePlan = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();
  const { watch } = useNoteFormContext();

  const updatePlanNote = () => {
    const updateOptions = checkCanUpdate({
      plan: { generalNotes: true },
    });
    const { canUpdate: canUpdateResult } = updateOptions;

    if (canUpdateResult) {
      const formValues = watch();

      updateEncounter({
        plan: {
          generalNotes: formValues.plan,
        },
      });
    }
  };

  return { updatePlanNote };
};

export const NotesSections = ({
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
        fieldName="subjective"
        isHighlighted={isHighlighted("subjective")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => {
          updateSubjectiveNote();
        }}
      />
      <SoapSection
        title="Objective"
        fieldName="objective"
        isHighlighted={isHighlighted("objective")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateObjectiveNote()}
      />
      <SoapSection
        title="Assessment"
        fieldName="assessment"
        isHighlighted={isHighlighted("assessment")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateAssessmentNote()}
      />
      <SoapSection
        title="Plan"
        fieldName="plan"
        isHighlighted={isHighlighted("plan")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updatePlanNote()}
      />
    </div>
  );
};
