import { useEffect } from "react";
import { useVimOsContext } from "./providers/VimOSContext";

export const App = () => {
  const vimOs = useVimOsContext();

  useEffect(() => {
    vimOs.hub.setActivationStatus("ENABLED");
  }, [vimOs]);

  return <div className="w-full pb-6">App</div>;
};
