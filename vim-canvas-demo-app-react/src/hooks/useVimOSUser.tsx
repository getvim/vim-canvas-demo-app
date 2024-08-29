import { useContext } from "react";
import { VimOSContext } from "../providers/VimOSContext";

export const useVimOSUser = () => {
  const vimOS = useContext(VimOSContext);
  return vimOS.sessionContext.user;
};
