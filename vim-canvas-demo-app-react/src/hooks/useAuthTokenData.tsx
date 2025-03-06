import { useEffect, useState } from "react";
import { useVimSettingsSdkContext } from "./useVimSettingsSdkContext";

export const useAuthTokenData = () => {
  const vimSettingsSDk = useVimSettingsSdkContext();
  const [idToken, setIdToken] = useState<string>("");

  useEffect(() => {
    const idToken = vimSettingsSDk.getIdToken();
    setIdToken(idToken);
  }, [setIdToken, vimSettingsSDk]);

  return { idToken };
};
