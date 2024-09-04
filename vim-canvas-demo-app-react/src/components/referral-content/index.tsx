import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSReferral } from "@/hooks/useReferral";
import { ReferralBasicInformation } from "./BasicInformation";
import { ReferralConditions } from "./Conditions";
import { ProviderSection } from "./Provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { EHR } from "vim-os-js-browser/types";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import targetProvidersJson from "./targetProviders.json";
import targetSpecialtiesJson from "./targetSpecialties.json";
import { SelectField } from "../update-fields/selectField";
import { ReferralProcedures } from "./Procedures";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";

export const ReferralContent = () => {
  const { jsonMode } = useAppConfig();
  const { referral } = useVimOSReferral();

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={referral} />
      ) : (
        <>
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
          <Collapsible>
            <div className="flex w-full justify-between items-center">
              <EntitySectionTitle title="Referring Provider" />
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <ProviderSection provider={referral?.referringProvider} />
            </CollapsibleContent>
          </Collapsible>
          <Separator className="mb-1" />
          <Collapsible>
            <div className="flex w-full justify-between items-center">
              <EntitySectionTitle title="Target Provider" />
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <ProviderSection provider={referral?.targetProvider} />
            </CollapsibleContent>
          </Collapsible>
          <h3 className="text-xs mt-2 mb-1 font-semibold">
            Target Provider Full Name
          </h3>
          <ReferralUpdateField<EHR.UpdatableProvider | undefined>
            value={referral?.targetProvider}
            canUpdateParam={{
              targetProvider: {
                npi: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              targetProvider: value,
            })}
            render={({ field }) => (
              <SelectField
                valueId={field.value?.npi}
                placeholder="Select target provider"
                options={targetProvidersJson}
                {...field}
              />
            )}
          />
          <h3 className="text-xs mt-4 mb-1 font-semibold">
            Target Provider Speciality
          </h3>
          <ReferralUpdateField<{ id?: string }>
            value={{ id: referral?.basicInformation?.specialty }}
            canUpdateParam={{
              basicInformation: {
                specialty: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              basicInformation: {
                specialty: value?.id,
              },
            })}
            render={({ field }) => (
              <SelectField
                valueId={field.value?.id}
                includeOptionsFields
                placeholder="Select speciality"
                options={targetSpecialtiesJson}
                {...field}
              />
            )}
          />
        </>
      )}
    </div>
  );
};
