import { useEffect, useState } from "react";
import { useVimOsContext } from "./useVimOsContext";
import { SessionContext } from "vim-os-js-browser/types";

export const useIdToken = () => {
  const { sessionContext } = useVimOsContext();

  const [idToken, setIdToken] = useState<
    SessionContext.GetIdTokenResponse["idToken"] | undefined
  >();

  useEffect(() => {
    if (sessionContext) {
      (async () => {
        try {
          setIdToken((await sessionContext.getIdToken())?.idToken);
        } catch {
          // SDK error — leave idToken undefined
        }
      })();
    }
  }, [sessionContext, setIdToken]);

  return { idToken };
};
