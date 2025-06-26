import { FormInputs } from "./encounter.form";
import { EHR } from "vim-os-js-browser/types";
import { get, set } from "lodash-es";

const CODE_FORM_FIELDS = ["diagnosisCodes", "procedureCodes"];

export const FORM_DATA_TO_VIM_OS_PATH_MAPPING: Record<
  keyof FormInputs,
  string
> = {
  subjectiveGeneralNotes: "subjective.generalNotes",
  subjectiveChiefComplaint: "subjective.chiefComplaintNotes",
  subjectiveHistoryOfPresentIllness: "subjective.historyOfPresentIllnessNotes",
  subjectiveReviewOfSystems: "subjective.reviewOfSystemsNotes",
  objectiveGeneralNotes: "objective.generalNotes",
  objectivePhysicalExamNotes: "objective.physicalExamNotes",
  assessmentGeneralNotes: "assessment.generalNotes",
  planGeneralNotes: "plan.generalNotes",
  patientInstructionsGeneralNotes: "patientInstructions.generalNotes",
  diagnosisCodes: "assessment.diagnosisCodes",
  procedureCodes: "billingInformation.procedureCodes",
};

const VIM_OS_PATH_TO_FORM_DATA_MAPPING = Object.fromEntries(
  Object.entries(FORM_DATA_TO_VIM_OS_PATH_MAPPING).map(([key, value]) => [
    value,
    key,
  ])
);

const removeUndefinedProperties = (obj: unknown) => {
  if (Array.isArray(obj) || typeof obj !== "object" || obj === null) {
    return obj;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      const nestedResult = removeUndefinedProperties(value);
      if (Object.keys(nestedResult as Record<string, unknown>).length > 0) {
        result[key] = nestedResult;
      }
    } else if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
};

export const buildEncounterPayload = (
  formData: FormInputs,
  canUpdateNotes: ReturnType<EHR.IResourceUpdater["canUpdateEncounter"]> & {
    canUpdate: boolean;
  }
) => {
  const vimOsFields = Object.keys(
    VIM_OS_PATH_TO_FORM_DATA_MAPPING
  ) as (keyof EHR.UpdateEncounterParams)[];

  const rawPayload: EHR.UpdateEncounterParams = {};

  vimOsFields.forEach((field) => {
    const formDataName = VIM_OS_PATH_TO_FORM_DATA_MAPPING[field];
    const formDataValue = get(formData, formDataName);

    const value = get(canUpdateNotes?.details, field)
      ? formDataValue ?? undefined
      : undefined;

    if (CODE_FORM_FIELDS.includes(formDataName)) {
      const mappedCodeValues = value?.map(
        ({ id, label }: { id: string; label: string }) => ({
          code: id,
          description: label,
        })
      );
      set(rawPayload, field, mappedCodeValues);
    } else {
      set(rawPayload, field, value);
    }
  });

  const payload = removeUndefinedProperties(rawPayload);

  return payload;
};

/**
 * Prepares the reset object for form reset based on canUpdate permissions
 */
export const prepareResetFields = (
  canUpdateNotes: ReturnType<EHR.IResourceUpdater["canUpdateEncounter"]> & {
    canUpdate: boolean;
  }
): Partial<FormInputs> => {
  const formFields = Object.keys(
    FORM_DATA_TO_VIM_OS_PATH_MAPPING
  ) as (keyof FormInputs)[];

  const resetData: Partial<FormInputs> = {};

  formFields.forEach((field) => {
    const path = FORM_DATA_TO_VIM_OS_PATH_MAPPING[field];
    const canUpdateField = path
      ? get(canUpdateNotes?.details, path)
      : undefined;
    resetData[field] = canUpdateField ? null : undefined;
  });

  return resetData;
};
