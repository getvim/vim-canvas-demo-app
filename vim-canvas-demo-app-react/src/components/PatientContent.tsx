import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSPatient } from "@/hooks/usePatient";
import { useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { JSONView } from "./ui/jsonView";
import { Separator } from "./ui/separator";
import {
  EntityFieldContent,
  EntityFieldReadonlyList,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "./ui/entityContent";
import { ProviderSection } from "./Provider";
import { capitalize } from "@/lib/utils";

export const PatientContent = () => {
  const { jsonMode } = useAppConfig();
  const { patient } = useVimOSPatient();
  const [problemList, setProblemList] = useState<EHR.Diagnosis[] | undefined>();

  useEffect(() => {
    if (patient) {
      (async () => {
        setProblemList(await patient.getProblemList());
      })();
    }
  }, [patient?.identifiers.vimPatientId, setProblemList]);

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={patient} />
      ) : (
        <>
          <EntitySectionTitle title="Identifiers" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR patient ID" />
              <EntityFieldReadonlyText
                text={patient?.identifiers.ehrPatientId}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Vim patient ID" />
              <EntityFieldReadonlyText
                text={patient?.identifiers.vimPatientId}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="MRN ID" />
              <EntityFieldReadonlyText text={patient?.identifiers.mrn} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Demographics" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="First name" />
              <EntityFieldReadonlyText
                text={patient?.demographics?.firstName}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Middle name" />
              <EntityFieldReadonlyText
                text={patient?.demographics?.middleName}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Last name" />
              <EntityFieldReadonlyText text={patient?.demographics?.lastName} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Date of birth" />
              <EntityFieldReadonlyText
                text={patient?.demographics?.dateOfBirth}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Gender" />
              <EntityFieldReadonlyText
                text={
                  patient?.demographics?.gender
                    ? capitalize(patient?.demographics?.gender)
                    : undefined
                }
              />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Address" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Address line 1" />
              <EntityFieldReadonlyText text={patient?.address?.address1} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Address line 2" />
              <EntityFieldReadonlyText text={patient?.address?.address2} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="City" />
              <EntityFieldReadonlyText text={patient?.address?.city} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="State" />
              <EntityFieldReadonlyText text={patient?.address?.state} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Zip" />
              <EntityFieldReadonlyText text={patient?.address?.zipCode} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Full address" />
              <EntityFieldReadonlyText text={patient?.address?.fullAddress} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Insurance" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="EHR Insurer name" />
              <EntityFieldReadonlyText
                text={patient?.insurance?.ehrInsurance}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Group ID" />
              <EntityFieldReadonlyText text={patient?.insurance?.groupId} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Payer ID" />
              <EntityFieldReadonlyText text={patient?.insurance?.payerId} />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Member ID" />
              <EntityFieldReadonlyText text={patient?.insurance?.memberId} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Contact" />
          <EntitySectionContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Home phone number" />
              <EntityFieldReadonlyText
                text={patient?.contact_info?.homePhoneNumber}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Mobile phone number" />
              <EntityFieldReadonlyText
                text={patient?.contact_info?.mobilePhoneNumber}
              />
            </EntityFieldContent>
            <EntityFieldContent>
              <EntityFieldTitle title="Email" />
              <EntityFieldReadonlyText text={patient?.contact_info?.email} />
            </EntityFieldContent>
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Problem list" />
          <EntityFieldReadonlyList list={problemList} />
          <Separator className="mb-1" />
          <ProviderSection provider={patient?.pcp} title="Provider" />
        </>
      )}
    </div>
  );
};
