import { useVimOsContext } from "@/hooks/useVimOsContext";
import { CopyIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { JSONView } from "./ui/jsonView";
import {
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "./ui/entityContent";
import { Button } from "./ui/button";
import { useIdToken } from "@/hooks/useIdToken";
import { useState } from "react";

export const SessionContextContent = () => {
  const { jsonMode } = useAppConfig();
  const { sessionContext } = useVimOsContext();
  const { idToken } = useIdToken();

  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const copyToClipboard = () => {
    if (idToken) {
      navigator.clipboard.writeText(idToken).then(() => {
        setCopyMessage("ID Token copied to clipboard");
        setTimeout(() => setCopyMessage(null), 2000);
      });
    } else {
      setCopyMessage("ID Token is not available.");
      setTimeout(() => setCopyMessage(null), 2000);
    }
  };

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={sessionContext} />
      ) : (
        <>
          <EntitySectionTitle title="Session Context" />
          <EntitySectionContent>
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
            <EntityFieldTitle title="Role(s)" />
            <EntityFieldReadonlyText
              className="whitespace-pre-line"
              text={sessionContext?.user?.identifiers?.roles?.join("\n")}
            />
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
              text={sessionContext?.organization?.identifiers?.tin.join(", ")}
            />
          </EntitySectionContent>
          <EntitySectionTitle title="Get ID token" />
          <EntitySectionContent>
            <EntityFieldTitle title="ID Token" />
            <div className="flex align-middle gap-3">
              <EntityFieldReadonlyText
                className="text-ellipsis overflow-hidden whitespace-nowrap min-w-0"
                text={idToken}
              />
              {idToken && (
                <Button
                  size={"sm"}
                  className="inline-flex aspect-square items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/90 rounded-md h-7 w-7 p-0"
                  variant={"ghost"}
                  onClick={copyToClipboard}
                  title="Copy ID token"
                >
                  <CopyIcon />
                </Button>
              )}
            </div>
            {copyMessage && (
              <div className="mt-1 text-xs text-green-600">{copyMessage}</div>
            )}
          </EntitySectionContent>
        </>
      )}
    </div>
  );
};
