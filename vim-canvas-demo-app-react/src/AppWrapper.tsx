import React, { useEffect, useState } from "react";
import { SDK } from "vim-os-js-browser/types";
import { loadSdk } from "vim-os-js-browser";
import { Toaster } from "@/components/ui/toaster";
import {
  VimOSContext,
  VimOSPatientProvider,
  VimOSEncounterProvider,
  VimOSReferralProvider,
  VimOSOrdersProvider,
} from "@/hooks/providers";
import { AppConfigProvider } from "@/hooks/providers/AppConfigContext";

export const AppWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [vimOS, setVimOS] = useState<SDK | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const vimOsSdk = await loadSdk();
      setVimOS(vimOsSdk);
      vimOsSdk.hub.setActivationStatus("ENABLED");
    })();
  }, []);

  if (!vimOS) {
    return <div>Loading VimSDK...</div>;
  }
  return (
    <AppConfigProvider>
      <Toaster />
      <VimOSContext.Provider value={vimOS}>
        <VimOSPatientProvider>
          <VimOSReferralProvider>
            <VimOSOrdersProvider>
              <VimOSEncounterProvider>{children}</VimOSEncounterProvider>
            </VimOSOrdersProvider>
          </VimOSReferralProvider>
        </VimOSPatientProvider>
      </VimOSContext.Provider>
    </AppConfigProvider>
  );
};
