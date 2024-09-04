import { EHR } from "vim-os-js-browser/types";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";

export const ProviderSection = ({ provider }: { provider?: EHR.Provider }) => {
  return (
    <>
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
          <EntityFieldReadonlyText text={provider?.demographics?.middleName} />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Last name" />
          <EntityFieldReadonlyText text={provider?.demographics?.lastName} />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Degree" />
          <EntityFieldReadonlyText text={provider?.providerDegree} />
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
      <EntitySectionTitle title="Provider Organization Address" />
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
          <EntityFieldReadonlyText text={provider?.facility?.address?.state} />
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
    </>
  );
};
