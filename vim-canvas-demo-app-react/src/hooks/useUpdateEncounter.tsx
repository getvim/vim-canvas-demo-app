import { useEffect, useMemo, useState } from "react";
import { useVimOsContext } from "./useVimOsContext";
import type { EHR } from "vim-os-js-browser/types";

export const useUpdateEncounter = (
  paramsToCheck?: EHR.CanUpdateEncounterParams
) => {
  const vimOS = useVimOsContext();

  const [canUpdateParams, setCanUpdateParams] = useState<boolean>(
    paramsToCheck
      ? vimOS.ehr.resourceUpdater.canUpdateEncounter(paramsToCheck).canUpdate
      : false
  );

  useEffect(() => {
    const cb = () =>
      setCanUpdateParams(
        paramsToCheck
          ? vimOS.ehr.resourceUpdater.canUpdateEncounter(paramsToCheck)
              .canUpdate
          : false
      );
    vimOS.ehr.resourceUpdater.subscribe("encounter", cb);
    return () => vimOS.ehr.resourceUpdater.unsubscribe("encounter", cb);
  }, [vimOS.ehr, paramsToCheck]);

  return useMemo(
    () => ({
      canUpdateParams,
      canUpdate: vimOS.ehr.resourceUpdater.canUpdateEncounter,
      updateEncounter: vimOS.ehr.resourceUpdater.updateEncounter,
    }),
    [vimOS.ehr.resourceUpdater, canUpdateParams]
  );
};
