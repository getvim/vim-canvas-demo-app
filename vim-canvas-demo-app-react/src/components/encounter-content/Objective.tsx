import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle
} from "../ui/entityContent";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";

export const EncounterObjective = () => {
  return (
    <>
      <EntitySectionTitle title="Objective" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="General notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              objective: {
                generalNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              objective: {
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
        <EntityFieldContent>
          <EntityFieldTitle title="Physical Exam notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              objective: {
                physicalExamNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              objective: {
                physicalExamNotes: value,
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
