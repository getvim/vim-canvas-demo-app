import { createContext, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";

interface PatientContext {
  patient: EHR.Patient | undefined;
}

export const VimOSPatientContext = createContext<PatientContext>({
  patient: undefined,
});

export const VimOSPatientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const vimOS = useVimOsContext();
  const [patient, setPatient] = useState<EHR.Patient | undefined>(undefined);

  useEffect(() => {
    vimOS.ehr.subscribe("patient", setPatient);

    return () => {
      vimOS.ehr.unsubscribe("patient", setPatient);
    };
  }, [vimOS]);

  return (
    <VimOSPatientContext.Provider
      value={{
        patient,
      }}
    >
      {children}
    </VimOSPatientContext.Provider>
  );
};
