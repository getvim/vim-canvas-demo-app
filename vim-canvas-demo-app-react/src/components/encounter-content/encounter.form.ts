import { useForm, useFormContext } from 'react-hook-form';

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
  encounterNotesGeneralNotes?: string | null;
  diagnosisCodes?: { id: string; label: string; note?: string }[] | null;
  procedureCodes?: { id: string; label: string }[] | null;
}

export const useEncounterForm = useForm<FormInputs>;

export const useEncounterFormContext = useFormContext<FormInputs>;
