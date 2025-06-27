import { useVimOSReferral } from "@/hooks/useReferral";
import { MultiSelectField } from "../update-fields/multiSelectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { useController } from "react-hook-form";
import { useReferralFormContext } from "./referral.form";

interface ReferralConditionsProps {
  selectedConditions: { id: string; label: string }[];
  setSelectedConditions: (conditions: { id: string; label: string }[]) => void;
}

export const ReferralConditions = ({
  selectedConditions,
  setSelectedConditions,
}: ReferralConditionsProps) => {
  const { referral } = useVimOSReferral();
  const { control } = useReferralFormContext();

  const { field: conditionField } = useController({
    name: "conditions",
    control,
    defaultValue: [],
  });

  return (
    <>
      <EntitySectionTitle title="Conditions" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldReadonlyList list={referral?.conditions?.diagnosis} />
          <ReferralUpdateField<{ id: string; label: string }[]>
            value={undefined}
            canUpdateParam={{
              conditions: {
                diagnosis: true,
              },
            }}
            valueToUpdatePayload={(values) => ({
              conditions: {
                diagnosis: values?.map((value) => ({
                  code: value.id,
                  description: value.label,
                })) as [
                  { code: string; description: string },
                  ...Array<{ code: string; description: string }>
                ],
              },
            })}
            render={({ field }) => (
              <MultiSelectField
                placeholder="Add code"
                includeOptionsFields
                formatOption={(option: { id: string; label: string }) =>
                  `${option.id} - ${option.label}`
                }
                selectedOptions={selectedConditions}
                onSelectedChange={(options) => {
                  setSelectedConditions(options);
                  conditionField.onChange(options);
                }}
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
