import { useContext } from "react";
import { AppConfigContext } from "./providers/AppConfigContext";

export const useAppConfig = () => {
  return useContext(AppConfigContext);
};
