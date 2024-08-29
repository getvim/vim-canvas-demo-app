import { createContext } from "react";
import { SDK } from "vim-os-js-browser/types";

export const VimOSContext = createContext<SDK>({} as SDK);
