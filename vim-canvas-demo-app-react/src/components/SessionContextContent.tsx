import { useVimOsContext } from "@/hooks/useVimOsContext";
import { Separator } from "./ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { JSONView } from "./ui/jsonView";
import { useEffect, useState } from "react";
import { SessionContext } from "vim-os-js-browser/types";
import {
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "./ui/entityContent";

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
          <EntitySectionTitle title="Session Context" />
          <EntitySectionContent>
            <EntityFieldTitle title="ID Token" />
            <EntityFieldReadonlyText text={idToken} />
            <EntityFieldTitle title="Session ID" />
            <EntityFieldReadonlyText text={sessionContext?.sessionId} />
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Identifiers" />
          <EntitySectionContent>
            <EntityFieldTitle title="EHR username" />
            <EntityFieldReadonlyText
              text={sessionContext?.user?.identifiers?.ehrUsername}
            />
            <EntityFieldTitle title="NPI" />
            <EntityFieldReadonlyText
              text={sessionContext?.user?.identifiers?.npi}
            />
            <EntityFieldTitle title="Vim user ID" />
            <EntityFieldReadonlyText
              text={sessionContext?.user?.identifiers?.vimUserID}
            />
            <EntityFieldTitle title="Session ID" />
            <EntityFieldReadonlyText text={sessionContext?.sessionId} />
            <EntityFieldTitle title="ID Token" />
            <EntityFieldReadonlyText text={idToken} />
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Demographics" />
          <EntitySectionContent>
            <EntityFieldTitle title="First name" />
            <EntityFieldReadonlyText
              text={sessionContext?.user?.demographics?.firstName}
            />
            <EntityFieldTitle title="Last name" />
            <EntityFieldReadonlyText
              text={sessionContext?.user?.demographics?.lastName}
            />
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Contact Information" />
          <EntitySectionContent>
            <EntityFieldTitle title="Email" />
            <EntityFieldReadonlyText
              text={sessionContext?.user?.contactInfo?.email}
            />
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="EHR Information" />
          <EntitySectionContent>
            <EntityFieldTitle title="EHR type" />
            <EntityFieldReadonlyText text={sessionContext?.ehrType} />
          </EntitySectionContent>
          <Separator className="mb-1" />
          <EntitySectionTitle title="Organization" />
          <EntitySectionContent>
            <EntityFieldTitle title="Organization name" />
            <EntityFieldReadonlyText
              text={sessionContext?.organization?.identifiers?.name}
            />
            <EntityFieldTitle title="Organization ID" />
            <EntityFieldReadonlyText
              text={sessionContext?.organization?.identifiers?.id}
            />
            <EntityFieldTitle title="TIN" />
            <EntityFieldReadonlyText
              text={sessionContext?.organization?.identifiers?.tin}
            />
          </EntitySectionContent>
        </>
      )}
    </div>
  );
};
