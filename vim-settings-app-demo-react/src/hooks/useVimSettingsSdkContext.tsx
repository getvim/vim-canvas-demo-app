import { useContext } from "react";
import { VimSettingsSdkContext } from "./providers/VimSettingsSdkContext";

export const useVimSettingsSdkContext = () => {
  return useContext(VimSettingsSdkContext);
};
