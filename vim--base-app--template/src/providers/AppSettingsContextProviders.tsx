import type { FC, PropsWithChildren } from "react";
import { VimOSContextProvider } from "./VimSettingsSdkContext";

export const AppSettingsContextProviders: FC<PropsWithChildren> = ({
  children,
}) => {
  return <VimOSContextProvider>{children}</VimOSContextProvider>;
};
