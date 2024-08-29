import { useContext } from "react";
import { VimOSEncounterContext } from "./providers";

export const useVimOSEncounter = () => {
  return useContext(VimOSEncounterContext);
};
