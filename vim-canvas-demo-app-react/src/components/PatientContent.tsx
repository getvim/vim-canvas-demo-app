import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSPatient } from "@/hooks/usePatient";
import { useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { JSONView } from "./ui/jsonView";
import { Separator } from "./ui/separator";

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
          <h2 className="my-3 text-sm font-bold">Identifier</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">EHR patient ID</h3>
              <p className="font-thin text-xs">
                {patient?.identifiers.ehrPatientId ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Vim patient ID</h3>
              <p className="font-thin text-xs">
                {patient?.identifiers.vimPatientId ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">MRN ID</h3>
              <p className="font-thin text-xs">{patient?.identifiers.mrn ?? '--'}</p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Demographics</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">First name</h3>
              <p className="font-thin text-xs">
                {patient?.demographics?.firstName ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Middle name</h3>
              <p className="font-thin text-xs">
                {patient?.demographics?.middleName ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Last name</h3>
              <p className="font-thin text-xs">
                {patient?.demographics?.lastName ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Date of birth</h3>
              <p className="font-thin text-xs">
                {patient?.demographics?.dateOfBirth ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Gender</h3>
              <p className="font-thin text-xs">
                {patient?.demographics?.gender ?? '--'}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Address</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Address line 1</h3>
              <p className="font-thin text-xs">{patient?.address?.address1 ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Address line 2</h3>
              <p className="font-thin text-xs">{patient?.address?.address2 ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">City</h3>
              <p className="font-thin text-xs">{patient?.address?.city ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">State</h3>
              <p className="font-thin text-xs">{patient?.address?.state ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Zip</h3>
              <p className="font-thin text-xs">{patient?.address?.zipCode ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Full address</h3>
              <p className="font-thin text-xs">
                {patient?.address?.fullAddress ?? '--'}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Contact Information</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Home phone number</h3>
              <p className="font-thin text-xs">
                {patient?.contact_info?.homePhoneNumber ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">
                Mobile phone number
              </h3>
              <p className="font-thin text-xs">
                {patient?.contact_info?.mobilePhoneNumber ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">
                Email
              </h3>
              <p className="font-thin text-xs">
                {patient?.contact_info?.email ?? '--'}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Insurance</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">EHR Insurer name</h3>
              <p className="font-thin text-xs">
                {patient?.insurance?.ehrInsurance ?? '--'}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Group ID</h3>
              <p className="font-thin text-xs">{patient?.insurance?.groupId ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Payer ID</h3>
              <p className="font-thin text-xs">{patient?.insurance?.payerId ?? '--'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Member ID</h3>
              <p className="font-thin text-xs">
                {patient?.insurance?.memberId ?? '--'}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Problem List</h2>
          <ul>
            {problemList?.map((problem, index) => (
              <li key={index} className="flex">
                <p className="font-semibold w-12 text-xs">{problem.code ?? '--'}</p>
                <p className="font-thin text-xs">- {problem.description ?? '--'}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
