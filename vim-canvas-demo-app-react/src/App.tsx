import encounterSvg from "@/assets/encounter.svg";

import patientSvg from "@/assets/patient.svg";
import referralSvg from "@/assets/referral.svg";
import userSvg from "@/assets/user.svg";
import { useEffect, useState } from "react";
import { EncounterContent } from "./components/encounter-content";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { OrdersWrapper } from "./components/orders/OrdersWrapper";
import { PatientContent } from "./components/PatientContent";
import { ReferralContent } from "./components/referral-content";
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
import { useVimOsContext } from "./hooks/useVimOsContext";

function App() {
  const vimOs = useVimOsContext();
  const { patient } = useVimOSPatient();
  const { encounter } = useVimOSEncounter();
  const { referral } = useVimOSReferral();
  const { orders } = useVimOSOrders();
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [redirectModalOpen, setRedirectModal] = useState(false);

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

  return (
    <div className="w-full top-0 left-0 pb-6">
      <Navbar />

      <CollapsibleEntity entityTitle="User" entityIconUrl={userSvg}>
        <CollapsibleEntityContent>
          <SessionContextContent />
        </CollapsibleEntityContent>
      </CollapsibleEntity>

      {patient && (
        <CollapsibleEntity entityTitle="Patient" entityIconUrl={patientSvg}>
          <CollapsibleEntityContent>
            <PatientContent />
          </CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
      {encounter && (
        <CollapsibleEntity entityTitle="Encounter" entityIconUrl={encounterSvg}>
          <CollapsibleEntityContent>
            <EncounterContent />
          </CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
      {referral && (
        <CollapsibleEntity entityTitle="Referral" entityIconUrl={referralSvg}>
          <CollapsibleEntityContent>
            <ReferralContent />
          </CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
      {orders && <OrdersWrapper orders={orders} />}
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

      <Footer />
    </div>
  );
}

export default App;
