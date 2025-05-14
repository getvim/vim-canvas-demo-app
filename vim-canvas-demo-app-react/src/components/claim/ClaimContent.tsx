import { useAppConfig } from "@/hooks/useAppConfig";
import { EHR } from "vim-os-js-browser/types";
import {
  EntityFieldContent, EntityFieldReadonlyList,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { JSONView } from "../ui/jsonView";
import { Separator } from "../ui/separator";
import { Fragment } from "react";
import {ProviderSection} from "@/components/Provider.tsx";

interface ClaimContentProps {
  claim: EHR.Claim;
}

function capitalizeFirstLetter(str: string | undefined): string {
  if (!str) return '';
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const ClaimContent: React.FC<ClaimContentProps> = ({ claim }) => {
  const { jsonMode } = useAppConfig();

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={claim} />
      ) : (
        <>
          <EntitySectionTitle title="Identifiers" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR claim ID" />
              <EntityFieldReadonlyText text={claim?.identifiers?.ehrClaimId} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR encounter ID" />
              <EntityFieldReadonlyText text={claim?.identifiers?.encounterId} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Basic Information" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Claim date" />
              <EntityFieldReadonlyText
                text={claim?.basicInformation?.claimDate?.toString() ?? "--"}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Service date" />
              <EntityFieldReadonlyText text={claim?.basicInformation?.serviceDate} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Insurance name" />
              <EntityFieldReadonlyText
                text={claim?.basicInformation?.insuranceName ?? "--"}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Place of service code" />
              <EntityFieldReadonlyText
                  text={claim?.basicInformation?.placeOfService?.code}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Place of service description" />
              <EntityFieldReadonlyText
                  text={capitalizeFirstLetter(claim?.basicInformation?.placeOfService?.description)}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Claim status" />
              <EntityFieldReadonlyText
                  text={claim?.basicInformation?.claimStatus ?? "--"}
              />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <ProviderSection provider={claim?.renderingProvider} title="Rendering provider" />
              <>
                <EntitySectionTitle title="Service lines" />
                {!claim?.serviceLines || !claim.serviceLines.length ? (
                    <EntityFieldReadonlyList list={[]} />
                ) : (
                    claim.serviceLines.map((serviceLine) => (
                        <Fragment key={serviceLine?.procedureCode}>
                          <EntitySectionTitle title="Service line" />
                          <EntitySectionContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedure code" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.procedureCode ||  '--'}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedure description" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.procedureDescription ?? "--"}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedure system" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.procedureSystem ?? "--"}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Units" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.units ?? "--"}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedures modifiers" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.proceduresModifiers?.toString() ?? "--"}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Diagnoses" />
                              <EntityFieldReadonlyList
                                  list={serviceLine?.diagnoses}
                              />
                            </EntityFieldContent>
                          </EntitySectionContent>
                          <Separator className="mb-1" />
                        </Fragment>
                    ))
                )}
              </>
          <EntityFieldTitle title="Additional diagnoses" />
          <EntityFieldReadonlyList
              list={claim?.additionalDiagnoses}
          />
        </>
      )}
    </div>
  );
};
