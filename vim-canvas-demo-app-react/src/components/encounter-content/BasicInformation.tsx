import { useVimOSEncounter } from "@/hooks/useEncounter";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { capitalize } from "@/lib/utils";

export const EncounterBasicInformation = () => {
  const { encounter } = useVimOSEncounter();

  return (
    <>
      <EntitySectionTitle title="Basic Information" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Encounter date" />
          <EntityFieldReadonlyText
            text={encounter?.basicInformation?.encounterDateOfService}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Status" />
          <EntityFieldReadonlyText
            text={
              encounter?.basicInformation?.status
                ? capitalize(encounter?.basicInformation?.status)
                : undefined
            }
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
