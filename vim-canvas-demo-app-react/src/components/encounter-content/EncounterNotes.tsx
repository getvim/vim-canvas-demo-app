import {
    EntityFieldContent,
    EntityFieldTitle,
    EntitySectionContent,
    EntitySectionTitle,
  } from "../ui/entityContent";
  import { TextareaField } from "../update-fields/textAreaField";
  import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";
  import { FormInputs, useEncounterFormContext } from "./encounter.form";
  import { useVimOSEncounter } from "@/hooks/useEncounter";
  
  export const EncounterGeneralNotes = () => {
    const { control } = useEncounterFormContext();
    const { encounter } = useVimOSEncounter();
    const { encounterNotes } = encounter || {};

    return (
      <>
        <EntitySectionTitle title="Encounter Notes" />
        <EntitySectionContent>
          <EntityFieldContent>
            <EntityFieldTitle title="General notes" />
            <EncounterUpdateField<string | undefined>
              canUpdateParam={{
                encounterNotes: {
                  generalNotes: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                encounterNotes: {
                  generalNotes: value,
                },
              })}
              render={({ field }) => (
                <TextareaField<FormInputs>
                  placeholder="Add notes here"
                  control={control}
                  name={"encounterNotesGeneralNotes"}
                  onTextareaSubmit={field.onChange}
                  disabled={field.disabled}
                  clearAfterChange
                  prefixAdornment={encounterNotes?.generalNotes}
                />
              )}
            />
          </EntityFieldContent>
        </EntitySectionContent>
      </>
    );
  };
  