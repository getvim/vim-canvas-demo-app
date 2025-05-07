import { useVimOSEncounter } from "@/hooks/useEncounter";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { MultiSelectField } from "../update-fields/multiSelectField";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";
import { FormInputs, useNoteFormContext } from "./form";

export const EncounterAssessment = () => {
  const { control } = useNoteFormContext();
  const { encounter } = useVimOSEncounter();
  const { assessment } = encounter || {};

  return (
    <>
      <EntitySectionTitle title="Assessment" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldReadonlyList list={assessment?.diagnosisCodes} />
          <EncounterUpdateField<{ id: string; label: string }[]>
            value={assessment?.diagnosisCodes?.length ? assessment.diagnosisCodes.map((code) => ({
              id: code.code,
              label: code.description || "",
            })) : undefined}
            canUpdateParam={{
              assessment: {
                diagnosisCodes: true,
              },
            }}
            valueToUpdatePayload={(values) => ({
              assessment: {
                diagnosisCodes: values?.map((value) => ({
                  code: value.id,
                  description: value.label,
                })) as [{ code: string; description: string }, ...Array<{ code: string; description: string }>],
              },
            })}
            render={({ field }) => (
              <MultiSelectField<{ id: string; label: string }[]>
                placeholder="Add ICD-10"
                includeOptionsFields
                formatOption={(option) => `${option.id} - ${option.label}`}
                options={[
                  { id: "E11.21", label: "DM with nephropathy" },
                  {
                    id: "E72.20",
                    label: "Disorder of urea cycle metabolism",
                  },
                  {
                    id: "I48.0",
                    label: "Paroxysmal atrial fibrillation",
                  },
                  {
                    id: "D69.6",
                    label: "Thrombocytopenia, unspecified",
                  },
                  {
                    id: "K55.1",
                    label: "Chronic vascular disorders of intestine",
                  },
                  {
                    id: "G31.9",
                    label:
                      "Degenerative disease of nervous system, unspecified",
                  },
                  { id: "F20.9", label: "Schizophrenia, unspecified" },
                  { id: "A00000", label: "Invalid ICD" },
                ]}
                {...field}
              />
            )}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="General notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              assessment: {
                generalNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              assessment: {
                generalNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"assessmentGeneralNotes"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={assessment?.generalNotes}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
