import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSReferral } from "@/hooks/useReferral";
import { EHR } from "vim-os-js-browser/types";
import { FormProvider } from "react-hook-form";
import { ProviderSection } from "../Provider";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { SelectField } from "../update-fields/selectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import { useReferralForm } from "./referral.form";
import { ReferralBasicInformation } from "./BasicInformation";
import { ReferralConditions } from "./Conditions";
import { ReferralProcedures } from "./Procedures";
import targetProvidersJson from "./targetProviders.json";

export const ReferralContent = () => {
  const { jsonMode } = useAppConfig();
  const { referral } = useVimOSReferral();
  const formProps = useReferralForm();

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={referral} />
      ) : (
        <FormProvider {...formProps}>
          <EntitySectionTitle title="Identifiers" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR referral ID" />
              <EntityFieldReadonlyText
                text={referral?.identifiers?.ehrReferralId}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Vim referral ID" />
              <EntityFieldReadonlyText
                text={referral?.identifiers?.vimReferralId}
              />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <ReferralBasicInformation />
          <Separator className="mb-1" />
          <ReferralConditions />
          <Separator className="mb-1" />
          <ReferralProcedures />
          <Separator className="mb-1" />
          <ProviderSection
            provider={referral?.referringProvider}
            title="Referring Provider"
          />
          <Separator className="mb-1" />
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
                {...field}
              />
            )}
          />
        </FormProvider>
      )}
    </div>
  );
};
