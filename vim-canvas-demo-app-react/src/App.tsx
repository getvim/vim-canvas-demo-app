import encounterSvg from "@/assets/encounter.svg";
import orderSvg from "@/assets/order.svg";
import patientSvg from "@/assets/patient.svg";
import referralSvg from "@/assets/referral.svg";
import userSvg from "@/assets/user.svg";
import { PatientContent } from "./components/PatientContent";
import { SessionContextContent } from "./components/SessionContextContent";
import {
  CollapsibleEntity,
  CollapsibleEntityContent,
} from "./components/ui/collapsibleEntity";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { Switch } from "./components/ui/switch";
import { useAppConfig } from "./hooks/useAppConfig";
import { useVimOSEncounter } from "./hooks/useEncounter";
import { useVimOSOrders } from "./hooks/useOrders";
import { useVimOSPatient } from "./hooks/usePatient";
import { useVimOSReferral } from "./hooks/useReferral";
import { ReferralContent } from "./components/referral-content";
import { EncounterContent } from "./components/encounter-content";
import { OrderContent } from "./components/OrderContent";

function App() {
  const { setJsonMode } = useAppConfig();
  const { patient } = useVimOSPatient();
  const { encounter } = useVimOSEncounter();
  const { referral } = useVimOSReferral();
  const { orders } = useVimOSOrders();

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <div className="p-5 py-2 bg-accent flex justify-between items-center space-x-2">
        <div>
          <h2 className="text-sm">Vim Canvas</h2>
          <h2 className="text-sm font-bold">Demo</h2>
        </div>
        <div className="flex items-center space-x-1">
          <Label className="text-xs" htmlFor="json-mode">
            JSON
          </Label>
          <Switch id="json-mode" onCheckedChange={setJsonMode} />
        </div>
      </div>

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
      {orders && (
        <CollapsibleEntity entityTitle="Order" entityIconUrl={orderSvg}>
          <CollapsibleEntityContent>
            <OrderContent />
          </CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
    </div>
  );
}

export default App;
