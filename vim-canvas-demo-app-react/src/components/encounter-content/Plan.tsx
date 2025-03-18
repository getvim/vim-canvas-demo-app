import { EHR } from "vim-os-js-browser/types";
import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { TextareaField } from "../update-fields/textAreaField";
import { EncounterUpdateField } from "../update-fields/updateFieldWrapper";
import { FormInputs, useNoteFormContext } from "./form";

export const EncounterPlan = ({
  currentValue,
}: {
  currentValue: EHR.Encounter["plan"];
}) => {
  const { control } = useNoteFormContext();
  return (
    <>
      <EntitySectionTitle title="Plan" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="General notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              plan: {
                generalNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              plan: {
                generalNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"planGeneralNotes"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={currentValue?.generalNotes}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
