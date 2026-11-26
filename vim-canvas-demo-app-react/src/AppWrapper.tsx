import React, { useEffect, useState } from "react";
import { AdapterActionsContext, loadAppSdk } from "@/utils/adapterActions";
import { Toaster } from "@/components/ui/toaster";
import {
  VimOSContext,
  VimOSPatientProvider,
  VimOSEncounterProvider,
  VimOSReferralProvider,
  VimOSOrdersProvider,
  VimOSClaimProvider,
} from "@/hooks/providers";
import { AppConfigProvider } from "@/hooks/providers/AppConfigContext";

export const AppWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [app, setApp] = useState<Awaited<ReturnType<typeof loadAppSdk>>>();
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    loadAppSdk().then(setApp, () => setLoadFailed(true));
  }, []);

  if (loadFailed) {
    return <div role="alert">Vim SDK could not initialize. Relaunch the app to try again.</div>;
  }
  if (!app) {
    return <div>Loading VimSDK...</div>;
  }
  return (
    <VimOSContext.Provider value={app.sdk}>
      <AdapterActionsContext.Provider value={app.actions}>
        <AppConfigProvider>
          <VimOSPatientProvider>
            <VimOSReferralProvider>
              <VimOSOrdersProvider>
                <VimOSClaimProvider>
                  <VimOSEncounterProvider>{children}</VimOSEncounterProvider>
                </VimOSClaimProvider>
              </VimOSOrdersProvider>
            </VimOSReferralProvider>
          </VimOSPatientProvider>
        </AppConfigProvider>
      </AdapterActionsContext.Provider>
      <Toaster />
    </VimOSContext.Provider>
  );
};
