import type { FC, PropsWithChildren } from "react";
import { VimOSContextProvider } from "./VimOSContext";

export const AppContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return <VimOSContextProvider>{children}</VimOSContextProvider>;
};
