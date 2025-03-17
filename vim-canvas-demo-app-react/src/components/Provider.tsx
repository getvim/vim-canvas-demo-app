import { CaretSortIcon } from "@radix-ui/react-icons";
import { EHR } from "vim-os-js-browser/types";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "./ui/entityContent";

export const ProviderSection = ({
  provider,
  title,
}: {
  provider?: EHR.Provider;
  title: string;
}) => {
  return (
    <Collapsible>
      <div className="flex w-full justify-between items-center">
        <EntitySectionTitle title={title} />
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <EntitySectionTitle title="Provider Identifier" />
        <EntitySectionContent>
          <EntityFieldContent>
            <EntityFieldTitle title="NPI" />
            <EntityFieldReadonlyText text={provider?.npi} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="EHR ID" />
            <EntityFieldReadonlyText text={provider?.ehrProviderId} />
          </EntityFieldContent>
        </EntitySectionContent>
        <EntitySectionTitle title="Provider Demographics" />
        <EntitySectionContent>
          <EntityFieldContent>
            <EntityFieldTitle title="First name" />
            <EntityFieldReadonlyText text={provider?.demographics?.firstName} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Middle name" />
            <EntityFieldReadonlyText
              text={provider?.demographics?.middleName}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Last name" />
            <EntityFieldReadonlyText text={provider?.demographics?.lastName} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Degree" />
            <EntityFieldReadonlyText text={provider?.providerDegree} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Speciality" />
            <ul className="mt-2">
              {provider?.specialty?.map((speciality, index) => (
                <li key={index} className="flex">
                  {speciality && speciality.trim() !== "" ? (
                    <p className="font-thin w-12 text-xs">{speciality}</p>
                  ) : (
                    <p className="font-normal w-12 text-xs">--</p>
                  )}
                </li>
              )) ?? <span className="font-normal text-xs">--</span>}
            </ul>
          </EntityFieldContent>
        </EntitySectionContent>
        <EntitySectionTitle title="Provider Contact Information" />
        <EntitySectionContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Email" />
            <EntityFieldReadonlyText
              text={provider?.facility?.contact_info?.email}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Home phone number" />
            <EntityFieldReadonlyText
              text={provider?.facility?.contact_info?.homePhoneNumber}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Mobile phone number" />
            <EntityFieldReadonlyText
              text={provider?.facility?.contact_info?.mobilePhoneNumber}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Fax number" />
            <EntityFieldReadonlyText
              text={provider?.facility?.contact_info?.faxNumber}
            />
          </EntityFieldContent>
        </EntitySectionContent>
        <EntitySectionTitle title="Provider Facility" />
        <EntitySectionContent>
          <EntityFieldContent>
            <EntityFieldTitle title="EHR Facility ID" />
            <EntityFieldReadonlyText text={provider?.facility?.facilityEhrId} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Facility NPI" />
            <EntityFieldReadonlyText text={provider?.facility?.facilityNpi} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Facility Name" />
            <EntityFieldReadonlyText text={provider?.facility?.name} />
          </EntityFieldContent>
        </EntitySectionContent>

        <EntitySectionTitle title="Provider Facility Address" />
        <EntitySectionContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Address 1" />
            <EntityFieldReadonlyText
              text={provider?.facility?.address?.address1}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Address 2" />
            <EntityFieldReadonlyText
              text={provider?.facility?.address?.address2}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="City" />
            <EntityFieldReadonlyText text={provider?.facility?.address?.city} />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="State" />
            <EntityFieldReadonlyText
              text={provider?.facility?.address?.state}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Zip Code" />
            <EntityFieldReadonlyText
              text={provider?.facility?.address?.zipCode}
            />
          </EntityFieldContent>
          <EntityFieldContent>
            <EntityFieldTitle title="Full address" />
            <EntityFieldReadonlyText
              text={provider?.facility?.address?.fullAddress}
            />
          </EntityFieldContent>
        </EntitySectionContent>
      </CollapsibleContent>
    </Collapsible>
  );
};
