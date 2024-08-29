import { useContext } from "react";
import { VimOSContext } from "./providers";

/**
 * Be careful with using this hook as it will cause a rerender for every change from vimOS.
 */
export const useVimOsContext = () => {
  return useContext(VimOSContext);
};
