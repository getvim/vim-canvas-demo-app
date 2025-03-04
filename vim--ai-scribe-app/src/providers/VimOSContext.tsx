import { createContext, useContext, useEffect, useState, type FC } from "react";
import { SDK } from "vim-os-js-browser/types";
import { loadSdk } from "vim-os-js-browser";

export const VimOSContext = createContext<SDK>({} as SDK);

export const useVimOsContext = () => {
  return useContext(VimOSContext);
};

export const VimOSContextProvider: FC<{ children: any }> = ({ children }) => {
  const [vimOS, setVimOS] = useState<SDK | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const vimOsSdk = await loadSdk();
      setVimOS(vimOsSdk);
    })();
  }, []);

  if (!vimOS) {
    return <div>Loading VimSDK...</div>;
  }

  return (
    <VimOSContext.Provider value={vimOS}>{children}</VimOSContext.Provider>
  );
};
