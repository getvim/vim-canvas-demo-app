import { createContext, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";

interface EncounterContext {
  encounter: EHR.Encounter | undefined;
}

export const VimOSEncounterContext = createContext<EncounterContext>({
  encounter: undefined,
});

export const VimOSEncounterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const vimOS = useVimOsContext();
  const [encounter, setEncounter] = useState<EHR.Encounter | undefined>(
    undefined
  );

  useEffect(() => {
    vimOS.ehr.subscribe("encounter", setEncounter);

    return () => {
      vimOS.ehr.unsubscribe("encounter", setEncounter);
    };
  }, [vimOS]);

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
