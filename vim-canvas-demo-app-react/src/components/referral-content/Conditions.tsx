import { useVimOSReferral } from "@/hooks/useReferral";
import { SelectField } from "../update-fields/selectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";

export const ReferralConditions = () => {
  const { referral } = useVimOSReferral();

  return (
    <>
      <EntitySectionTitle title="Conditions" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldReadonlyList list={referral?.conditions?.diagnosis} />
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
                placeholder="Add code"
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
                ]}
                {...field}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
