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

export const EncounterSubjective = () => {
  const { control } = useNoteFormContext();
  const { encounter } = useVimOSEncounter();
  const { subjective } = encounter || {};
  return (
    <>
      <EntitySectionTitle title="Subjective" />
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Chief Complaint" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              subjective: {
                chiefComplaintNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              subjective: {
                chiefComplaintNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"subjectiveChiefComplaint"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={subjective?.chiefComplaintNotes}
              />
            )}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="General notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              subjective: {
                generalNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              subjective: {
                generalNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"subjectiveGeneralNotes"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={subjective?.generalNotes}
              />
            )}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="History of Present Illness" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              subjective: {
                historyOfPresentIllnessNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              subjective: {
                historyOfPresentIllnessNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"subjectiveHistoryOfPresentIllness"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={subjective?.historyOfPresentIllnessNotes}
              />
            )}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Review of Systems" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={{
              subjective: {
                reviewOfSystemsNotes: true,
              },
            }}
            valueToUpdatePayload={(value) => ({
              subjective: {
                reviewOfSystemsNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name={"subjectiveReviewOfSystems"}
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={subjective?.reviewOfSystemsNotes}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
