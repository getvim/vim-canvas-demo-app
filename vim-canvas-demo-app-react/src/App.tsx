import userSvg from "@/assets/user.svg";
import patientSvg from "@/assets/patient.svg";
import encounterSvg from "@/assets/encounter.svg";
import referralSvg from "@/assets/referral.svg";
import orderSvg from "@/assets/order.svg";
import {
  CollapsibleEntity,
  CollapsibleEntityContent,
} from "./components/ui/collapsibleEntity";
import { useVimOSEncounter } from "./hooks/useEncounter";
import { useVimOSOrders } from "./hooks/useOrders";
import { useVimOSPatient } from "./hooks/usePatient";
import { useVimOSReferral } from "./hooks/useReferral";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { SessionContextContent } from "./components/SessionContextContent";
import { useAppConfig } from "./hooks/useAppConfig";

function App() {
  const { setJsonMode } = useAppConfig();
  const { patient } = useVimOSPatient();
  const { encounter } = useVimOSEncounter();
  const { referral } = useVimOSReferral();
  const { orders } = useVimOSOrders();

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <div className="p-5 flex items-center space-x-2 justify-end">
        <Label htmlFor="json-mode">JSON Mode</Label>
        <Switch id="json-mode" onCheckedChange={setJsonMode} />
      </div>
      <Separator className="w-[calc(100%-20px)] ml-[10px] bg-gray-300" />

      <CollapsibleEntity entityTitle="User" entityIconUrl={userSvg}>
        <CollapsibleEntityContent>
          <SessionContextContent />
        </CollapsibleEntityContent>
      </CollapsibleEntity>

      {patient && (
        <CollapsibleEntity entityTitle="Patient" entityIconUrl={patientSvg}>
          <CollapsibleEntityContent>Hello</CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
      {encounter && (
        <CollapsibleEntity entityTitle="Encounter" entityIconUrl={encounterSvg}>
          <CollapsibleEntityContent>Hello</CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
      {referral && (
        <CollapsibleEntity entityTitle="Referral" entityIconUrl={referralSvg}>
          <CollapsibleEntityContent>Hello</CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
      {orders && (
        <CollapsibleEntity entityTitle="Order" entityIconUrl={orderSvg}>
          <CollapsibleEntityContent>Hello</CollapsibleEntityContent>
        </CollapsibleEntity>
      )}
    </div>
  );
}

export default App;
