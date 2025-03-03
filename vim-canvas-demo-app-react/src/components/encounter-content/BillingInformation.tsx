import {
  EntityFieldContent,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { SelectField } from "../update-fields/selectField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";

const CPT_CODES_OPTIONS = [
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
    label: "COLONOSCOPY, FLEXIBLE; WITH BIOPSY, SINGLE OR MULTIPLE",
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
  { id: "9999", label: "Invalid CPT" },
];

export const EncounterBillingInformation = () => {
  return (
    <>
      <EntitySectionTitle title="Billing Information" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EncounterUpdateField<{ id: string; label: string } | undefined>
            canUpdateParam={{
              billingInformation: {
                procedureCodes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              billingInformation: {
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
                options={CPT_CODES_OPTIONS}
                {...field}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
