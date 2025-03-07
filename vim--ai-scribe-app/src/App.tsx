import { useEffect } from "react";
import { useVimOsContext } from "./providers/VimOSContext";
import { AiScribeDemo } from "./components/organisms/ai-scribe-demo/AiScribeDemo";
import "globals";

const useExploreNotification = () => {
  const vimOs = useVimOsContext();

  useEffect(() => {
    try {
      vimOs.hub.pushNotification.show({
        text: `Explore the <b>Vim AI Scribe Demo</b> app to view SDK capabilities, grab app code, and unlock opportunities`,
        notificationId: crypto.randomUUID(),
        actionButtons: {
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
  }, [vimOs.hub.pushNotification]);
};

const useSetAppEnabled = () => {
  const vimOs = useVimOsContext();

  useEffect(() => {
    vimOs.hub.setActivationStatus("ENABLED");
  }, [vimOs]);
};

export const App = () => {
  useExploreNotification();
  useSetAppEnabled();

  return (
    <div className="w-full pb-6">
      <AiScribeDemo />
    </div>
  );
};
