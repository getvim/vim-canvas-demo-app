import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";

export const EncounterPI = () => {
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
              <TextareaField
                placeholder="Add notes here"
                {...field}
                clearAfterChange
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
