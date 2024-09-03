import { useVimOSReferral } from "@/hooks/useReferral";
import { SelectField } from "../update-fields/selectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";

export const ReferralConditions = () => {
  const { referral } = useVimOSReferral();

  return (
    <>
      <h2 className="my-3 text-sm font-bold">Conditions</h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <ul className="mb-2">
            {referral?.conditions?.diagnosis?.map((diagnosis, index) => (
              <li key={index} className="flex">
                <p className="font-semibold w-12 text-xs">
                  {diagnosis.code ?? "--"}
                </p>
                <p className="font-thin text-xs">
                  - {diagnosis.description ?? "--"}
                </p>
              </li>
            ))}
          </ul>
          <ReferralUpdateField<{ id: string; label: string } | undefined>
            value={undefined}
            canUpdateParam={{
              conditions: {
                diagnosis: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              conditions: {
                diagnosis: value
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
