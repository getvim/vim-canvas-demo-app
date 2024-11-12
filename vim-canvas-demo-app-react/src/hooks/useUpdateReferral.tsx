import { useEffect, useMemo, useState } from "react";
import { useVimOsContext } from "./useVimOsContext";
import type { EHR } from "vim-os-js-browser/types";

export const useUpdateReferral = (
  paramsToCheck?: EHR.CanUpdateReferralParams
) => {
  const vimOS = useVimOsContext();

  const [canUpdateParams, setCanUpdateParams] = useState<boolean>(
    paramsToCheck
      ? vimOS.ehr.resourceUpdater.canUpdateReferral(paramsToCheck).canUpdate
      : false
  );

  useEffect(() => {
    const cb = () =>
      setCanUpdateParams(
        paramsToCheck
          ? vimOS.ehr.resourceUpdater.canUpdateReferral(paramsToCheck).canUpdate
          : false
      );
    vimOS.ehr.resourceUpdater.subscribe("referral", cb);
    return () => vimOS.ehr.resourceUpdater.unsubscribe("referral", cb);
  }, [vimOS.ehr, paramsToCheck]);

  return useMemo(
    () => ({
      canUpdateParams,
      canUpdate: vimOS.ehr.resourceUpdater.canUpdateReferral,
      updateReferral: vimOS.ehr.resourceUpdater.updateReferral,
    }),
    [vimOS.ehr.resourceUpdater, canUpdateParams]
  );
};
