import { useEffect } from "react";
import { useVimOsContext } from "./providers/VimOSContext";

export const App = () => {
  const vimOs = useVimOsContext();

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
              //   setRedirectUrl("https://github.com/getvim/vim-canvas-demo-app");
              //   setRedirectModal(true);
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
  }, [vimOs]);

  return <div className="w-full pb-6">App</div>;
};
