import orderSvg from "@/assets/order.svg";
import referralSvg from "@/assets/referral.svg";
import { EncounterContent } from "./components/encounter-content";
import { Navbar } from "./components/Navbar";
import { OrderContent } from "./components/OrderContent";
import { ReferralContent } from "./components/referral-content";
import {
	CollapsibleEntity,
	CollapsibleEntityContent,
} from "./components/ui/collapsibleEntity";
import { useVimOSEncounter } from "./hooks/useEncounter";
import { useVimOSOrders } from "./hooks/useOrders";
import { useVimOSReferral } from "./hooks/useReferral";
import { useVimOsContext } from "./hooks/useVimOsContext";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";

function App() {
	const vimOs = useVimOsContext();
	const { encounter } = useVimOSEncounter();
	const { referral } = useVimOSReferral();
	const { orders } = useVimOSOrders();
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
	const [redirectModalOpen, setRedirectModal] = useState(false);

	useEffect(() => {
		if (encounter) {
			vimOs.hub.setActivationStatus('ENABLED');
      vimOs.hub.setDynamicAppSize('CLASSIC');
		} else {
			vimOs.hub.setActivationStatus('DISABLED');
		}
	}, [vimOs, setRedirectUrl, encounter]);

	const onRedirectModalChange = (open: boolean) => {
		if (!open) {
			setRedirectUrl(undefined);
		}
		setRedirectModal(open);
	};

	return (
		<div className="w-full top-0 left-0 pb-6">
			<Navbar />

			{encounter && (
				<div className="encounter-container">
					<EncounterContent />
				</div>
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
		</div>
	);
}

export default App;
