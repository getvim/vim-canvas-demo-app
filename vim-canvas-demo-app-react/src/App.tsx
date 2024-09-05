import encounterSvg from "@/assets/encounter.svg";
import orderSvg from "@/assets/order.svg";
import patientSvg from "@/assets/patient.svg";
import referralSvg from "@/assets/referral.svg";
import userSvg from "@/assets/user.svg";
import { EncounterContent } from "./components/encounter-content";
import { Navbar } from "./components/Navbar";
import { OrderContent } from "./components/OrderContent";
import { PatientContent } from "./components/PatientContent";
import { ReferralContent } from "./components/referral-content";
import { SessionContextContent } from "./components/SessionContextContent";
import {
  CollapsibleEntity,
  CollapsibleEntityContent,
} from "./components/ui/collapsibleEntity";
import { useVimOSEncounter } from "./hooks/useEncounter";
import { useVimOSOrders } from "./hooks/useOrders";
import { useVimOSPatient } from "./hooks/usePatient";
import { useVimOSReferral } from "./hooks/useReferral";

function App() {
  const { patient } = useVimOSPatient();
  const { encounter } = useVimOSEncounter();
  const { referral } = useVimOSReferral();
  const { orders } = useVimOSOrders();

  return (
    <div className="w-full h-full absolute top-0 left-0">
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
