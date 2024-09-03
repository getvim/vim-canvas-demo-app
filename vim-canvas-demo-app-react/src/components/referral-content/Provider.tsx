import { EHR } from "vim-os-js-browser/types";

export const ProviderSection = ({ provider }: { provider?: EHR.Provider }) => {
  return (
    <>
      <h2 className="my-3 text-[0.8rem] font-bold">Provider Identifier</h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">NPI</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">{provider?.npi ?? "--"}</p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">EHR ID</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.ehrProviderId ?? "--"}
              </p>
            </p>
          </div>
        </div>
      </div>
      <h2 className="my-3 text-[0.8rem] font-bold">Provider Demographics</h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">First name</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.demographics?.firstName ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Middle name</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.demographics?.middleName ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Last name</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.demographics?.lastName ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Degree</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.providerDegree ?? "--"}
              </p>
            </p>
          </div>
        </div>
      </div>
      <h2 className="my-3 text-[0.8rem] font-bold">
        Provider Contact Information
      </h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Email</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.contact_info?.email ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Home phone number</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.contact_info?.homePhoneNumber ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Mobile phone number</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.contact_info?.mobilePhoneNumber ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Fax number</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.contact_info?.faxNumber ?? "--"}
              </p>
            </p>
          </div>
        </div>
      </div>
      <h2 className="my-3 text-[0.8rem] font-bold">
        Provider Organization Address
      </h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Address 1</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.address?.address1 ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Address 2</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.address?.address2 ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">City</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.address?.city ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">State</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.address?.state ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Zip Code</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.address?.zipCode ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Full address</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {provider?.facility?.address?.fullAddress ?? "--"}
              </p>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
