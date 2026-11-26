import encounterSvg from "@/assets/encounter.svg";

import patientSvg from "@/assets/patient.svg";
import claimSvg from "@/assets/claim.svg";
import referralSvg from "@/assets/referral.svg";
import userSvg from "@/assets/user.svg";
import { useEffect, useState } from "react";
import type { Hub } from "vim-os-js-browser/types";
import { AdapterActions } from "./components/AdapterActions";
import { EncounterContent } from "./components/encounter-content";
import { Footer } from "./components/Footer";
import { DemoTabs } from "./components/DemoTabs";
import { Navbar } from "./components/Navbar";
import { OrdersWrapper } from "./components/orders/OrdersWrapper";
import { PatientContent } from "./components/PatientContent";
import { ReferralContent } from "./components/referral-content";
import { ClaimContent } from "./components/claim/ClaimContent";
import { SessionContextContent } from "./components/SessionContextContent";
import { Button } from "./components/ui/button";
import {
  CollapsibleEntity,
  CollapsibleEntityContent,
} from "./components/ui/collapsibleEntity";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { useVimOSEncounter } from "./hooks/useEncounter";
import { useVimOSOrders } from "./hooks/useOrders";
import { useVimOSPatient } from "./hooks/usePatient";
import { useVimOSReferral } from "./hooks/useReferral";
import { useVimOSClaim } from "./hooks/useClaim";
import { useVimOsContext } from "./hooks/useVimOsContext";
import type { Settings } from "../types";
import { loadAdapterActionsEnabled, loadSettings } from "./utils/settings-api";
import { useIdToken } from "./hooks/useIdToken";

function App() {
  const vimOs = useVimOsContext();
  const { patient } = useVimOSPatient();
  const { encounter } = useVimOSEncounter();
  const { referral } = useVimOSReferral();
  const { orders, orderCreatedEvents } = useVimOSOrders();
  const { claim } = useVimOSClaim();
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [redirectModalOpen, setRedirectModal] = useState(false);
  const [authenticatedSettings, setAuthenticatedSettings] = useState<{
    token: string;
    settings: Settings | null;
  }>();
  const [enabledOrganizationId, setEnabledOrganizationId] = useState<number>();
  const [appSize, setAppSize] = useState<Hub.ApplicationSize>("CLASSIC");
  const { idToken } = useIdToken();
  const organizationId = vimOs.sessionContext?.organization?.identifiers?.id;
  const settings = authenticatedSettings?.token === idToken ? authenticatedSettings?.settings : null;
  const themeColor = settings?.theme_color || "#04B39F";
  const adapterActionsEnabled = organizationId
    ? enabledOrganizationId === organizationId
    : settings?.adapter_actions_enabled === true;
  const appExpanded = appSize === "EXTRA_LARGE";

  function changeAppSize(size: Hub.ApplicationSize) {
    setAppSize(size);
    vimOs.hub.setDynamicAppSize(size);
  }

  useEffect(() => {
    vimOs.hub.setActivationStatus("ENABLED");
    try {
      vimOs.hub.pushNotification.show({
        text: `Explore the <b>Vim Canvas™️ Demo</b> app to view SDK capabilities, grab app code, and unlock opportunities`,
        notificationId: crypto.randomUUID(),
        actionButtons: {
          leftButton: {
            text: "View code",
            buttonStyle: "LINK",
            callback: () => {
              setRedirectUrl("https://github.com/getvim/vim-canvas-demo-app");
              setRedirectModal(true);
            },
            openAppButton: true,
          },
          rightButton: {
            text: "Explore app",
            buttonStyle: "PRIMARY",
            openAppButton: true,
            callback: () => {},
          },
        },
      });
    } catch (e) {
      console.error("failed to show push notification", e);
    }
  }, [vimOs, setRedirectUrl]);

  const onRedirectModalChange = (open: boolean) => {
    if (!open) {
      setRedirectUrl(undefined);
    }
    setRedirectModal(open);
  };

  useEffect(() => {
    if (!idToken) return;

    let active = true;
    loadSettings(idToken)
      .then((settings) => {
        if (active) setAuthenticatedSettings({ token: idToken, settings });
      })
      .catch((error) => console.error("Failed to load settings", error));

    return () => {
      active = false;
    };
  }, [idToken]);

  useEffect(() => {
    if (!organizationId) return;

    const controller = new AbortController();
    const { signal } = controller;
    loadAdapterActionsEnabled(organizationId, signal)
      .then((enabled) => {
        if (!signal.aborted) setEnabledOrganizationId(enabled ? organizationId : undefined);
      })
      .catch((error) => {
        if (!signal.aborted) console.error("Failed to load Adapter Actions setting", error);
      });

    return () => controller.abort();
  }, [organizationId]);

  return (
    <div className="w-full top-0 left-0 pb-6">
      <Navbar themeColor={themeColor} appSize={appSize} onAppSizeChange={changeAppSize} />

      <DemoTabs
        actions={adapterActionsEnabled ? (
          <AdapterActions
            expanded={appExpanded}
            onToggleExpanded={() => changeAppSize(appExpanded ? "CLASSIC" : "EXTRA_LARGE")}
          />
        ) : undefined}
      >
        <CollapsibleEntity
          entityTitle="User"
          entityIconUrl={userSvg}
          themeColor={themeColor}
        >
          <CollapsibleEntityContent>
            <SessionContextContent />
          </CollapsibleEntityContent>
        </CollapsibleEntity>

        {patient && (
          <CollapsibleEntity
            entityTitle="Patient"
            entityIconUrl={patientSvg}
            themeColor={themeColor}
          >
            <CollapsibleEntityContent>
              <PatientContent />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        )}
        {encounter && (
          <CollapsibleEntity
            entityTitle="Encounter"
            entityIconUrl={encounterSvg}
            themeColor={themeColor}
          >
            <CollapsibleEntityContent>
              <EncounterContent />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        )}
        {referral && (
          <CollapsibleEntity
            entityTitle="Referral"
            entityIconUrl={referralSvg}
            themeColor={themeColor}
          >
            <CollapsibleEntityContent>
              <ReferralContent />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        )}
        <OrdersWrapper
          orders={orders}
          orderCreatedEvents={orderCreatedEvents}
          themeColor={themeColor}
        />
        {claim && (
          <CollapsibleEntity
            entityTitle="Claim"
            entityIconUrl={claimSvg}
            themeColor={themeColor}
          >
            <CollapsibleEntityContent>
              <ClaimContent claim={claim} />
            </CollapsibleEntityContent>
          </CollapsibleEntity>
        )}
      </DemoTabs>
      <Dialog open={redirectModalOpen} onOpenChange={onRedirectModalChange}>
        <DialogContent className="max-w-[calc(100%-100px)] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redirect Confirmation</DialogTitle>
            <DialogDescription>
              You are about to be redirected to an external link. Are you sure
              you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center gap-1">
            <Button
              variant="secondary"
              onClick={() => onRedirectModalChange(false)}
            >
              Cancel
            </Button>
            <a href={redirectUrl} target="_blank">
              <Button>Redirect</Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer themeColor={themeColor} />
    </div>
  );
}

export default App;
