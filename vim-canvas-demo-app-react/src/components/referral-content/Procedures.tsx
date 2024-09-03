import { useVimOSReferral } from "@/hooks/useReferral";
import { SelectField } from "../update-fields/selectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";

export const ReferralProcedures = () => {
  const { referral } = useVimOSReferral();

  return (
    <>
      <h2 className="my-3 text-sm font-bold">Procedure Codes</h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <ul>
            {referral?.procedureCodes?.cpts?.map((cpt, index) => (
              <li key={index} className="flex">
                <p className="font-semibold w-12 text-xs">{cpt.code ?? "--"}</p>
                <p className="font-thin text-xs">- {cpt.description ?? "--"}</p>
                <p className="font-thin ml-2 text-xs">| {cpt.system ?? "--"}</p>
              </li>
            ))}
          </ul>
          <ReferralUpdateField<{ id: string; label: string } | undefined>
            value={undefined}
            canUpdateParam={{
              procedureCodes: {
                cpts: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              procedureCodes: {
                cpts: value
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
                placeholder="Add condition"
                includeOptionsFields
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
                ]}
                {...field}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};
