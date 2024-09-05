import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSEncounter } from "@/hooks/useEncounter";
import { EncounterBasicInformation } from "./BasicInformation";
import { EncounterSubjective } from "./Subjective";
import { EncounterObjective } from "./Objective";
import { EncounterAssessment } from "./Assessment";
import { EncounterPlan } from "./Plan";
import { EncounterPI } from "./PatientInstructions";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionTitle,
} from "../ui/entityContent";
import { ProviderSection } from "../Provider";

export const EncounterContent = () => {
  const { jsonMode } = useAppConfig();
  const { encounter } = useVimOSEncounter();

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={encounter} />
      ) : (
        <>
          <EntitySectionTitle title="Identifiers" />
          <EntityFieldContent>
            <EntityFieldTitle title="EHR Encounter ID" />
            <EntityFieldReadonlyText
              text={encounter?.identifiers?.ehrEncounterId}
            />
          </EntityFieldContent>
          <Separator className="mb-1" />
          <EncounterBasicInformation />
          <Separator className="mb-1" />
          <EncounterSubjective />
          <Separator className="mb-1" />
          <EncounterObjective />
          <Separator className="mb-1" />
          <EncounterAssessment />
          <Separator className="mb-1" />
          <EncounterPlan />
          <Separator className="mb-1" />
          <EncounterPI />
          <Separator className="mb-1" />
          <ProviderSection provider={encounter?.provider} title="Provider" />
        </>
      )}
    </div>
  );
};
