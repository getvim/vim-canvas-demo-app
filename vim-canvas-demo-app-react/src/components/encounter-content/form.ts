import { useForm, useFormContext } from "react-hook-form";

export interface FormInputs {
  subjectiveGeneralNotes?: string | null;
  subjectiveChiefComplaint?: string | null;
  subjectiveReviewOfSystems?: string | null;
  subjectiveHistoryOfPresentIllness?: string | null;
  objectiveGeneralNotes?: string | null;
  objectivePhysicalExamNotes?: string | null;
  assessmentGeneralNotes?: string | null;
  planGeneralNotes?: string | null;
  patientInstructionsGeneralNotes?: string | null;
}

export const useNotesForm = useForm<FormInputs>;

export const useNoteFormContext = useFormContext<FormInputs>;
