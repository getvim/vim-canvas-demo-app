import { EHR } from "vim-os-js-browser/types";
import { ProviderSection } from "../Provider";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import { SelectField } from "../update-fields/selectField";
import targetProvidersJson from "./targetProviders.json";
import { useVimOSReferral } from "@/hooks/useReferral";
import { useController } from "react-hook-form";
import { useReferralFormContext } from "./referral.form";

export const TargetProvider = () => {
  const { referral } = useVimOSReferral();
  const { control } = useReferralFormContext();

  const { field: targetProviderField } = useController({
    name: "targetProvider",
    control,
    defaultValue: referral?.targetProvider || null,
  });

  return (
    <>
      <ProviderSection
        provider={referral?.targetProvider}
        title="Target Provider"
      />
      <h3 className="text-xs mt-2 mb-1 font-semibold">
        Target Provider Full Name
      </h3>
      <ReferralUpdateField<EHR.UpdatableProvider | undefined>
        value={referral?.targetProvider}
        canUpdateParam={{
          targetProvider: true,
        }}
        valueToUpdatePayload={(value) => ({
          targetProvider: value,
        })}
        render={({ field }) => (
          <SelectField
            valueName="npi"
            selectedValue={field.value?.npi}
            placeholder="Select target provider"
            options={targetProvidersJson}
            isDirty={Boolean(targetProviderField.value)}
            onSelectedChange={targetProviderField.onChange}
            disabled={field.disabled}
            onChange={field.onChange}
          />
        )}
      />
    </>
  );
};
