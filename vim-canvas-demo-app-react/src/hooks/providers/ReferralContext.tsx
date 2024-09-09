import { createContext, useEffect, useState } from "react";
import { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "../useVimOsContext";
import { useAppConfig } from "../useAppConfig";

interface ReferralContext {
  referral: EHR.Referral | undefined;
}

export const VimOSReferralContext = createContext<ReferralContext>({
  referral: undefined,
});

export const VimOSReferralProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { updateNotification } = useAppConfig();
  const vimOS = useVimOsContext();
  const [referral, setReferral] = useState<EHR.Referral | undefined>(undefined);

  useEffect(() => {
    vimOS.ehr.subscribe("referral", (data) => {
      setReferral(data);
      updateNotification("referral", data ? 1 : 0);
    });

    return () => {
      vimOS.ehr.unsubscribe("referral", setReferral);
    };
  }, [vimOS, updateNotification]);

  return (
    <VimOSReferralContext.Provider
      value={{
        referral,
      }}
    >
      {children}
    </VimOSReferralContext.Provider>
  );
};
