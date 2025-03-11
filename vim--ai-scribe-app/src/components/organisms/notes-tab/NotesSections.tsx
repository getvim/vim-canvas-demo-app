import {
  useUpdateEncounter,
  useUpdateEncounterSubscription,
} from "@/vimOs/useUpdateEncounter";
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

const useUpdateSubjective = () => {
  const encounterUpdates = useUpdateEncounterSubscription(
    {
      subjective: {
        generalNotes: true,
        chiefComplaintNotes: true,
        historyOfPresentIllnessNotes: true,
        reviewOfSystemsNotes: true,
      },
    },
    "subjective",
    {
      subjective: [
        "chiefComplaintNotes",
        "reviewOfSystemsNotes",
      ],
    }
  );

  const { updateSubscriptionField, canUpdateSubscriptionParams } =
    encounterUpdates;
  const { watch } = useNoteFormContext();

  const updateSubjectiveNote = () => {
    if (canUpdateSubscriptionParams) {
      const formValues = watch();

      updateSubscriptionField(formValues.subjective);
    }
  };

  return {
    canUpdate: canUpdateSubscriptionParams,
    updateSubjectiveNote,
  };
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
  const { updateSubjectiveNote, canUpdate } = useUpdateSubjective();
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
        isWriteAvailable={canUpdate}
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
