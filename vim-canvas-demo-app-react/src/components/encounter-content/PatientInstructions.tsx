import { useVimOSEncounter } from "@/hooks/useEncounter";
import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";
import { FormInputs, useEncounterFormContext } from "./encounter.form";

export const EncounterPI = () => {
  const { control } = useEncounterFormContext();
  const { encounter } = useVimOSEncounter();
  const { patientInstructions } = encounter || {};

  return (
    <>
      <EntitySectionTitle title="Patient Instructions" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="General notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              patientInstructions: {
                generalNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              patientInstructions: {
                generalNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"patientInstructionsGeneralNotes"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={patientInstructions?.generalNotes}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
