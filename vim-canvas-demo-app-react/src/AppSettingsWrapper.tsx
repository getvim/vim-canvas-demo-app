import { useEffect, useState } from "react";
import { loadSettingsSdk } from "vim-app-settings";
import { SETTINGS_SDK } from "vim-app-settings/types";
import { VimSettingsSdkContext } from "@/hooks/providers/VimSettingsSdkContext";
import { BrandCustomization } from "./components/settings-app/BrandCustomization";

export const AppSettingsWrapper: React.FC = () => {
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
    <VimSettingsSdkContext.Provider value={vimSettingsSDK}>
      <BrandCustomization />
    </VimSettingsSdkContext.Provider>
  );
};
