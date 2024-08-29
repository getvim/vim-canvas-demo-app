import React, { useEffect, useState } from "react";
import { SDK } from "vim-os-js-browser/types";
import { loadSdk } from "vim-os-js-browser";
import { VimOSContext } from "./providers/VimOSContext";

export const AppWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [vimOS, setVimOS] = useState<SDK | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const vimOsSdk = await loadSdk();
      setVimOS(vimOsSdk);
      vimOsSdk.hub.setActivationStatus("ENABLED");
    })();
  }, []);

  if (!vimOS) {
    return <div>Loading VimSDK...</div>;
  }
  return (
    <VimOSContext.Provider value={vimOS}>{children}</VimOSContext.Provider>
  );
};
