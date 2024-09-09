import { createContext, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";
import { useAppConfig } from "../useAppConfig";

interface EncounterContext {
  encounter: EHR.Encounter | undefined;
}

export const VimOSEncounterContext = createContext<EncounterContext>({
  encounter: undefined,
});

export const VimOSEncounterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { updateNotification } = useAppConfig();
  const vimOS = useVimOsContext();
  const [encounter, setEncounter] = useState<EHR.Encounter | undefined>(
    undefined
  );

  useEffect(() => {
    vimOS.ehr.subscribe("encounter", (data) => {
      setEncounter(data);
      updateNotification("encounter", data ? 1 : 0);
    });

    return () => {
      vimOS.ehr.unsubscribe("encounter", setEncounter);
    };
  }, [vimOS, updateNotification]);

  return (
    <VimOSEncounterContext.Provider
      value={{
        encounter,
      }}
    >
      {children}
    </VimOSEncounterContext.Provider>
  );
};
