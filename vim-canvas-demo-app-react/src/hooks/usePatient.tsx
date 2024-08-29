import { useContext } from "react";
import { VimOSPatientContext } from "./providers";

export const useVimOSPatient = () => {
  return useContext(VimOSPatientContext);
};
