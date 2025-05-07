import { useVimOSReferral } from "@/hooks/useReferral";
import { MultiSelectField } from "../update-fields/multiSelectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";

export const ReferralProcedures = () => {
  const { referral } = useVimOSReferral();

  return (
    <>
      <EntitySectionTitle title="Procedure Codes" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldReadonlyList list={referral?.procedureCodes?.cpts} />
          <ReferralUpdateField<{ id: string; label: string }[]>
            value={undefined}
            canUpdateParam={{
              procedureCodes: {
                cpts: true,
              },
            }}
            valueToUpdatePayload={(values) => ({
              procedureCodes: {
                cpts: values?.map((value) => ({
                  code: value.id,
                  description: value.label,
                })) as [{ code: string; description: string }, ...Array<{ code: string; description: string }>],
              },
            })}
            render={({ field }) => (
              <MultiSelectField
                placeholder="Add code"
                includeOptionsFields
                formatOption={(option) => `${option.id} - ${option.label}`}
                options={[
                  {
                    id: "99203",
                    label: "Office/outpatient new low mdm 30-44 minutes",
                  },
                  { id: "77057", label: "Bilateral Screening Mammogram" },
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
                  {
                    id: "9999",
                    label: "Invalid CPT",
                  },
                ]}
                direction="up"
                {...field}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
