import { createContext, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";
import { useAppConfig } from "../useAppConfig";

interface PatientContext {
  patient: EHR.Patient | undefined;
}

export const VimOSPatientContext = createContext<PatientContext>({
  patient: undefined,
});

export const VimOSPatientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { updateNotification } = useAppConfig();
  const vimOS = useVimOsContext();
  const [patient, setPatient] = useState<EHR.Patient | undefined>(undefined);

  useEffect(() => {
    vimOS.ehr.subscribe("patient", (data) => {
      setPatient(data);
      updateNotification("patient", data ? 1 : 0);
    });

    return () => {
      vimOS.ehr.unsubscribe("patient", setPatient);
    };
  }, [vimOS, updateNotification]);

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
