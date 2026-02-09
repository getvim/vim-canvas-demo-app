import { useVimOSEncounter } from "@/hooks/useEncounter";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { capitalize } from "@/lib/utils";
import { formatContentDate } from "@/utils/formatContentDate";
export const EncounterBasicInformation = () => {
  const { encounter } = useVimOSEncounter();

  return (
    <>
      <EntitySectionTitle title="Basic Information" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Encounter date" />
          <EntityFieldReadonlyText
            text={formatContentDate(
              encounter?.basicInformation?.encounterDateOfService
            )}
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
        <EntityFieldContent>
          <EntityFieldTitle title="Self pay" />
          <EntityFieldReadonlyText
            text={
              encounter?.basicInformation?.selfPay === undefined
                ? undefined
                : encounter?.basicInformation?.selfPay
                ? "True"
                : "False"
            }
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
