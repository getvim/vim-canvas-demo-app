import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";
import { FormInputs, useNoteFormContext } from "./form";
import { useVimOSEncounter } from "@/hooks/useEncounter";

export const EncounterObjective = () => {
  const { control } = useNoteFormContext();
  const { encounter } = useVimOSEncounter();
  const { objective } = encounter || {};
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
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"objectiveGeneralNotes"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={objective?.generalNotes}
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
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"objectivePhysicalExamNotes"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={objective?.physicalExamNotes}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
