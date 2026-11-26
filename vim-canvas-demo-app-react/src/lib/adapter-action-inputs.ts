import { z } from "zod";

const patientId = z.string().min(1).describe("EHR patient ID");
const encounterId = z.string().min(1).describe("EHR encounter ID");
const date = z.string().date();
const encounterInput = z.object({ patientId, encounterId }).strict();

// These inputs follow the adapter API schemas in Bookmd.
export const adapterActionInputs = {
  FIND_PATIENT: z.object({
    demographics: z.object({
      firstName: z.string().min(1).describe("First name"),
      lastName: z.string().min(1).describe("Last name"),
      dateOfBirth: date.describe("Date of birth"),
      address: z.object({ zipCode: z.string().describe("ZIP code") }).strict().optional(),
    }).strict(),
    insurance: z.object({
      memberId: z.string().describe("Insurance member ID").optional(),
    }).strict().default({}),
    patientId: patientId.optional(),
  }).strict(),
  GET_PATIENT: z.object({ patientId }).strict(),
  GET_PATIENT_ENCOUNTERS: z.object({
    patientId,
    fromDate: date.describe("From date").optional(),
    untilDate: date.describe("Until date").optional(),
  }).strict(),
  GET_ENCOUNTER_DATA: encounterInput,
  GET_ENCOUNTER_CPTS: encounterInput,
  GET_ENCOUNTER_LAB_RESULTS: encounterInput,
  GET_ENCOUNTER_VITALS: encounterInput,
  PRINT_ENCOUNTER: encounterInput,
};

export type AdapterAction = keyof typeof adapterActionInputs;

export const adapterActions = Object.keys(adapterActionInputs) as AdapterAction[];

export function getAdapterActionPayload(action: AdapterAction, input: unknown) {
  const parsed = adapterActionInputs[action].parse(input);

  // Legacy eCW requires this field even when returning the document to the app.
  return action === "PRINT_ENCOUNTER"
    ? { ...parsed, pdfUploadUrl: "https://dummy-url.invalid" }
    : parsed;
}
