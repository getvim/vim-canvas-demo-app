import { useVimOsContext } from "@/hooks/useVimOsContext";
import { Separator } from "./ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { JSONView } from "./ui/jsonView";
import { useEffect, useState } from "react";
import { SessionContext } from "vim-os-js-browser/types";

export const SessionContextContent = () => {
  const { jsonMode } = useAppConfig();
  const { sessionContext } = useVimOsContext();

  const [idToken, setIdToken] = useState<
    SessionContext.GetIdTokenResponse["idToken"] | undefined
  >();

  useEffect(() => {
    if (sessionContext) {
      (async () => {
        setIdToken((await sessionContext.getIdToken())?.idToken);
      })();
    }
  }, [sessionContext, setIdToken]);

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={sessionContext} />
      ) : (
        <>
          <h2 className="my-3 text-sm font-bold">Identifiers</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">EHR username</h3>
              <p className="font-thin text-xs">
                {sessionContext?.user?.identifiers?.ehrUsername ?? "--"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">NPI</h3>
              <p className="font-thin text-xs">
                {sessionContext?.user?.identifiers?.npi ?? "--"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Vim user ID</h3>
              <p className="font-thin text-xs">
                {sessionContext?.user?.identifiers?.vimUserID ?? "--"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Session ID</h3>
              <p className="font-thin text-xs">
                {sessionContext?.sessionId ?? "--"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">ID Token</h3>
              <p className="font-thin text-xs  truncate">{idToken ?? "--"}</p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Demographics</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">First name</h3>
              <p className="font-thin text-xs">
                {sessionContext?.user?.demographics?.firstName ?? "--"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Last name</h3>
              <p className="font-thin text-xs">
                {sessionContext?.user?.demographics?.lastName ?? "--"}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Contact Information</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Email</h3>
              <p className="font-thin text-xs">
                {sessionContext?.user?.contactInfo?.email ?? "--"}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">EHR Information</h2>
          <div className="mb-2">
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">EHR type</h3>
              <p className="font-thin text-xs">
                {sessionContext?.ehrType ?? "--"}
              </p>
            </div>
          </div>
          <Separator className="mb-1" />
          <h2 className="my-3 text-sm font-bold">Organization</h2>
          <div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Organization name</h3>
              <p className="font-thin text-xs">
                {sessionContext?.organization?.identifiers?.name ?? "--"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xs mt-2 font-semibold">Organization ID</h3>
              <p className="font-thin text-xs">
                {sessionContext?.organization?.identifiers?.id ?? "--"}
              </p>
            </div>
            <div>
              <h3 className="text-xs mt-2 font-semibold">TIN</h3>
              <p className="font-thin text-xs">
                {sessionContext?.organization?.identifiers?.tin ?? "--"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
