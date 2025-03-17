import { useUpdateEncounterSubscription } from "@/vimOs/useUpdateEncounter";
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
  const encounterUpdates = useUpdateEncounterSubscription<"subjective">(
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
      subjective: ["chiefComplaintNotes", "reviewOfSystemsNotes"],
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
    canUpdateSubjectiveNote: canUpdateSubscriptionParams,
    updateSubjectiveNote,
  };
};

const useUpdateObjective = () => {
  const encounterUpdates = useUpdateEncounterSubscription<"objective">(
    {
      objective: {
        generalNotes: true,
        physicalExamNotes: true,
      },
    },
    "objective",
    {
      objective: ["generalNotes", "physicalExamNotes"],
    }
  );

  const { updateSubscriptionField, canUpdateSubscriptionParams } =
    encounterUpdates;
  const { watch } = useNoteFormContext();

  const updateObjectiveNote = () => {
    if (canUpdateSubscriptionParams) {
      const formValues = watch();

      updateSubscriptionField(formValues.objective);
    }
  };

  return {
    canUpdateObjectiveNote: canUpdateSubscriptionParams,
    updateObjectiveNote,
  };
};

const useUpdateAssessment = () => {
  const encounterUpdates = useUpdateEncounterSubscription<"assessment">(
    {
      assessment: {
        generalNotes: true,
      },
    },
    "assessment",
    {
      assessment: ["generalNotes"],
    }
  );

  const { updateSubscriptionField, canUpdateSubscriptionParams } =
    encounterUpdates;
  const { watch } = useNoteFormContext();

  const updateAssessmentNote = () => {
    if (canUpdateSubscriptionParams) {
      const formValues = watch();

      updateSubscriptionField(formValues.assessment);
    }
  };

  return {
    canUpdateAssessmentNote: canUpdateSubscriptionParams,
    updateAssessmentNote,
  };
};

const useUpdatePlan = () => {
  const encounterUpdates = useUpdateEncounterSubscription<"plan">(
    {
      plan: {
        generalNotes: true,
      },
    },
    "plan",
    {
      plan: ["generalNotes"],
    }
  );

  const { updateSubscriptionField, canUpdateSubscriptionParams } =
    encounterUpdates;
  const { watch } = useNoteFormContext();

  const updatePlanNote = () => {
    if (canUpdateSubscriptionParams) {
      const formValues = watch();

      updateSubscriptionField(formValues.plan);
    }
  };

  return {
    canUpdatePlanNote: canUpdateSubscriptionParams,
    updatePlanNote,
  };
};

export const NotesSections = ({
  hoveredSegment,
  transcriptionSegments,
  renderHighlightedText,
}: NotePanelProps) => {
  const { updateSubjectiveNote, canUpdateSubjectiveNote } =
    useUpdateSubjective();
  const { updateObjectiveNote, canUpdateObjectiveNote } = useUpdateObjective();
  const { updateAssessmentNote, canUpdateAssessmentNote } =
    useUpdateAssessment();
  const { updatePlanNote, canUpdatePlanNote } = useUpdatePlan();

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
        isWriteAvailable={canUpdateSubjectiveNote}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => {
          updateSubjectiveNote();
        }}
      />
      <SoapSection
        title="Objective"
        fieldName="objective"
        isHighlighted={isHighlighted("objective")}
        isWriteAvailable={canUpdateObjectiveNote}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateObjectiveNote()}
      />
      <SoapSection
        title="Assessment"
        fieldName="assessment"
        isHighlighted={isHighlighted("assessment")}
        isWriteAvailable={canUpdateAssessmentNote}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updateAssessmentNote()}
      />
      <SoapSection
        title="Plan"
        fieldName="plan"
        isHighlighted={isHighlighted("plan")}
        isWriteAvailable={canUpdatePlanNote}
        renderHighlightedText={renderHighlightedText}
        onPushToEHR={() => updatePlanNote()}
      />
    </div>
  );
};
