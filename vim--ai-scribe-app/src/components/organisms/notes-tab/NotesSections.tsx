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

export const NotesSections = ({
  hoveredSegment,
  transcriptionSegments,
  renderHighlightedText,
}: NotePanelProps) => {
  const { updateSubjectiveNote } = useUpdateSubjective();
  const { updateObjectiveNote } = useUpdateObjective();
  const { updateAssessmentNote } = useUpdateAssessment();
  const { updatePlanNote } = useUpdatePlan();
  const { watch } = useNoteFormContext();
  const formValues = watch();

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
        onPushToEHR={() => updateSubjectiveNote(formValues.subjective)}
      />
      <SoapSection
        title="Objective"
        fieldName="objective"
        isHighlighted={isHighlighted("objective")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateObjectiveNote(formValues.objective)}
      />
      <SoapSection
        title="Assessment"
        fieldName="assessment"
        isHighlighted={isHighlighted("assessment")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateAssessmentNote(formValues.assessment)}
      />
      <SoapSection
        title="Plan"
        fieldName="plan"
        isHighlighted={isHighlighted("plan")}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updatePlanNote(formValues.plan)}
      />
    </div>
  );
};
