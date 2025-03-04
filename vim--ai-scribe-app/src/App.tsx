import { useEffect } from "react";
import { useVimOsContext } from "./providers/VimOSContext";
import { AiScribeDemo } from "./components/ai-scribe/AiScribeDemo";
import "globals";

export const App = () => {
  const vimOs = useVimOsContext();

  useEffect(() => {
    vimOs.hub.setActivationStatus("ENABLED");
  }, [vimOs]);

  return (
    <div className="w-full pb-6">
      <AiScribeDemo />
    </div>
  );
};
