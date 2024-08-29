import { useContext } from "react";
import { VimOSOrdersContext } from "./providers";

export const useVimOSOrders = () => {
  return useContext(VimOSOrdersContext);
};
