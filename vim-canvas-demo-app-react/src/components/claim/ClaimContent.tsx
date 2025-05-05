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
import {Fragment} from "react";
import {ProviderSection} from "@/components/Provider.tsx";

interface ClaimContentProps {
  claim: EHR.Claim;
}

export const ClaimContent: React.FC<ClaimContentProps> = ({ claim }) => {
  const { jsonMode } = useAppConfig();

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={claim} />
      ) : (
        <>
          <EntitySectionTitle title="Identifier" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR Cliam ID" />
              <EntityFieldReadonlyText text={claim?.identifiers?.ehrClaimId} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR Encounter ID" />
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
              <EntityFieldTitle title="Service Date" />
              <EntityFieldReadonlyText text={claim?.basicInformation?.serviceDate} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Insurance Name" />
              <EntityFieldReadonlyText
                text={claim?.basicInformation?.insuranceName ?? "--"}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Place Of Service" />
              <EntityFieldReadonlyText
                  text={claim?.basicInformation?.placeOfService?.description}
              />
              <EntityFieldReadonlyText
                  text={claim?.basicInformation?.placeOfService?.code}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Claim Status" />
              <EntityFieldReadonlyText
                  text={claim?.basicInformation?.claimStatus ?? "--"}
              />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <ProviderSection provider={claim?.renderingProvider} title="renderingProvider" />
              <>
                <EntitySectionTitle title="ServiceLines" />
                {!claim?.serviceLines || !claim.serviceLines.length ? (
                    <EntityFieldReadonlyList list={[]} />
                ) : (
                    claim.serviceLines.map((serviceLine) => (
                        <Fragment key={serviceLine?.procedureCode}>
                          <EntitySectionTitle title="serviceLine" />
                          <EntitySectionContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedure Code" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.procedureCode ||  '--'}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedure Description" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.procedureDescription ?? "--"}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Procedure System" />
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
                              <EntityFieldTitle title="Procedures Modifiers" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.proceduresModifiers?.toString() ?? "--"}
                              />
                            </EntityFieldContent>
                            <EntityFieldContent>
                              <EntityFieldTitle title="Diagnoses" />
                              <EntityFieldReadonlyText
                                  text={serviceLine?.diagnoses?.toString() ?? "--"}
                              />
                            </EntityFieldContent>
                          </EntitySectionContent>
                          <Separator className="mb-1" />
                        </Fragment>
                    ))
                )}
              </>
        </>
      )}
    </div>
  );
};
