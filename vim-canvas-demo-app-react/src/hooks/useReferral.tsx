import { useContext } from "react";
import { VimOSReferralContext } from "./providers";

export const useVimOSReferral = () => {
  return useContext(VimOSReferralContext);
};
