import { useContext } from "react";
import { VimOSClaimContext } from "./providers";

export const useVimOSClaim = () => {
  return useContext(VimOSClaimContext);
};
