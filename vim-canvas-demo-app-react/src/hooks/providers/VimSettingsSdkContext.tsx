import { createContext } from "react";
import { SETTINGS_SDK } from "vim-app-settings/types";

export const VimSettingsSdkContext = createContext<SETTINGS_SDK>(
  {} as SETTINGS_SDK
);
