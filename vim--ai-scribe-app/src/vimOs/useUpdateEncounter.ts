import { useMemo } from "react";
import type { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "@/providers/VimOSContext";

export const useUpdateEncounter = () => {
  const vimOS = useVimOsContext();

  return useMemo(
    () => ({
      checkCanUpdate: vimOS.ehr.resourceUpdater.canUpdateEncounter,
      updateEncounter: (payload: EHR.UpdateEncounterParams) =>
        vimOS.ehr.resourceUpdater
          .updateEncounter(payload)
          .then(() => {
            console.log({
              variant: "default",
              title: "Encounter notes updated!",
            });
          })
          .catch((error) => {
            console.log({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error ? JSON.stringify(error) : "An error occurred.",
            });
          }),
    }),
    [vimOS.ehr.resourceUpdater]
  );
};
