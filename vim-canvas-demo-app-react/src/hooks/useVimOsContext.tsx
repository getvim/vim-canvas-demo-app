import { useContext } from "react";
import { VimOSContext } from "./providers";

export const useVimOsContext = () => {
  return useContext(VimOSContext);
};
