import { createContext, useContext, useEffect, useState, type FC } from "react";
import { loadSettingsSdk } from "vim-app-settings";
import { SETTINGS_SDK } from "vim-app-settings/types";

export const VimOSSettingsContext = createContext<SETTINGS_SDK>(
  {} as SETTINGS_SDK
);

export const useVimOsSettingsContext = () => {
  return useContext(VimOSSettingsContext);
};

export const VimOSContextProvider: FC<{ children: any }> = ({ children }) => {
  const [vimSettingsSDK, setVimSettingsSDK] = useState<
    SETTINGS_SDK | undefined
  >(undefined);

  useEffect(() => {
    const loadSdk = async () => {
      const settingsSDK = await loadSettingsSdk();
      setVimSettingsSDK(settingsSDK);
    };
    loadSdk();
  }, []);

  if (!vimSettingsSDK) {
    return <div>Loading VimSettingsSDK...</div>;
  }

  return (
    <VimOSSettingsContext.Provider value={vimSettingsSDK}>
      {children}
    </VimOSSettingsContext.Provider>
  );
};
