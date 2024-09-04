import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle
} from "../ui/entityContent";
import { SelectField } from "../update-fields/selectField";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";

export const EncounterPlan = () => {
  return (
    <>
      <EntitySectionTitle title="Plan" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EncounterUpdateField<{ id: string; label: string } | undefined>
            value={undefined}
            canUpdateParam={{
              plan: {
                procedureCodes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              plan: {
                procedureCodes: value
                  ? [
                      {
                        code: value.id,
                        description: value.label,
                      },
                    ]
                  : undefined,
              },
            })}
            render={({ field }) => (
              <SelectField
                placeholder="Add CPT"
                includeOptionsFields
                formatOption={(option) => `${option.id} - ${option.label}`}
                options={[
                  {
                    id: "3077F",
                    label: "Most recent systolic blood pressure /equal 140 mm",
                  },
                  {
                    id: "77057",
                    label: "Bilateral Screening Mammogram",
                  },
                  {
                    id: "45380",
                    label:
                      "COLONOSCOPY, FLEXIBLE; WITH BIOPSY, SINGLE OR MULTIPLE",
                  },
                  {
                    id: "2023F",
                    label:
                      "Dilated retinal eye exam with interpretation by an ophthalmologist or optometrist documented and reviewed; without evidence of retinopathy (DM)",
                  },
                  {
                    id: "21010",
                    label: "Under Incision Procedures on the Head",
                  },
                  {
                    id: "39545",
                    label: "Under Repair Procedures on the Diaphragm",
                  },
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
              plan: {
                generalNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              plan: {
                generalNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField
                placeholder="Add notes here"
                {...field}
                clearAfterChange
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
