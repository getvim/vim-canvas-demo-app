import { useVimOSEncounter } from '@/hooks/useEncounter';
import {
  EntityFieldContent,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from '../ui/entityContent';
import { DiagnosisMultiSelectField } from '../update-fields/diagnosisMultiSelectField';
import { TextareaField } from '../update-fields/textAreaField';
import { EncounterUpdateField } from '../update-fields/updateFieldWrapper';
import { FormInputs, useEncounterFormContext } from './encounter.form';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import { Button } from '../ui/button';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { SmallActionButtons } from '../ui/smallActionButtons';
import { TextareaWithAdornment } from '../ui/textareaWithAdornment';
import { EHR } from 'vim-os-js-browser/types';

/**
 * Type definition for a diagnosis code with note (API response format)
 * Matches the structure returned by the API
 */
interface DiagnosisCodeWithNote {
  code: string;
  description?: string;
  note?: string;
}

/**
 * Type definition for a diagnosis code in form control format
 * Used for managing codes in react-hook-form and dropdown selections
 */
interface FormDiagnosisCode {
  id: string;
  label: string;
  note?: string;
}

/**
 * Type definition for diagnosis code API payload
 * Used when sending diagnosis codes to the API (description is required)
 */
interface DiagnosisCodePayload {
  code: string;
  description: string;
  note?: string;
}

/**
 * Default ICD-10 diagnosis codes available for selection
 */
const DEFAULT_DIAGNOSIS_CODES = [
  { id: 'E11.21', label: 'DM with nephropathy' },
  { id: 'E72.20', label: 'Disorder of urea cycle metabolism' },
  { id: 'I48.0', label: 'Paroxysmal atrial fibrillation' },
  { id: 'D69.6', label: 'Thrombocytopenia, unspecified' },
  { id: 'K55.1', label: 'Chronic vascular disorders of intestine' },
  { id: 'G31.9', label: 'Degenerative disease of nervous system, unspecified' },
  { id: 'F20.9', label: 'Schizophrenia, unspecified' },
  { id: 'A00000', label: 'Invalid ICD' },
];

/**
 * Permission configuration for updating diagnosis codes
 * Shared across all diagnosis code update operations
 */
const DIAGNOSIS_CODES_CAN_UPDATE_PARAM = {
  assessment: {
    diagnosisCodes: true,
  },
} as const;

const DIAGNOSIS_CODES_NOTES_CAN_UPDATE_PARAM = {
  assessment: {
    diagnosisCodesNotes: true,
  },
} as const;

const GENERAL_NOTES_CAN_UPDATE_PARAM = {
  assessment: {
    generalNotes: true,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates a single diagnosis code entry for the API payload.
 * Converts from various formats to the API-expected format.
 */
const createDiagnosisCodeEntry = (
  code: string,
  description: string,
  note?: string,
): DiagnosisCodePayload => {
  return {
    code,
    description,
    ...(note && { note }),
  };
};

/**
 * Creates the full payload for updating diagnosis codes.
 * Handles both single diagnosis codes and arrays of diagnosis codes.
 * Returns a properly typed payload for the EncounterUpdateField component.
 */
const createDiagnosisCodesUpdatePayload = (
  codes: DiagnosisCodePayload | DiagnosisCodePayload[],
) => {
  const diagnosisCodes = Array.isArray(codes) ? codes : [codes];
  return {
    assessment: {
      diagnosisCodes: diagnosisCodes as [DiagnosisCodePayload, ...DiagnosisCodePayload[]],
    },
  };
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Editable note field for diagnosis codes (both saved and new)
 * Provides save/cancel functionality with optional prefix adornment for saved notes
 */
const DiagnosisCodeNoteField = ({
  originalNote,
  currentNote,
  onChange,
  onSave,
  onCancel,
  disabled,
  requireNoteForSave = false,
}: {
  originalNote?: string;
  currentNote: string;
  onChange: (note: string) => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
  requireNoteForSave?: boolean;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [key, setKey] = useState<number>(+new Date());
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editMode) {
      // Focus textarea when entering edit mode
      setTimeout(() => textAreaRef.current?.focus(), 0);
    }
  }, [editMode]);

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    onCancel(); // Clear the note
    setKey(+new Date());
  };

  const handleSave = () => {
    setEditMode(false);
    onSave(); // Submit to API
    setKey(+new Date());
  };

  return (
    <div className="flex w-full relative justify-between">
      <div className="relative w-full">
        <TextareaWithAdornment
          prefixAdornment={originalNote}
          key={key}
          placeholder="Add note here"
          value={currentNote}
          onChange={(e) => onChange(e.target.value)}
          disabled={!editMode || disabled}
          ref={textAreaRef}
        />
        {!editMode && (
          <div
            onClick={() => !disabled && turnOnEditMode()}
            className="absolute bottom-0 left-0 w-full h-[50px] cursor-text"
          />
        )}
      </div>
      {!editMode ? (
        <Button
          size="sm"
          className="absolute right-0 bottom-0 h-7 w-7 p-0 rounded-tr-none rounded-bl-none"
          onClick={turnOnEditMode}
          disabled={disabled}
        >
          <Pencil1Icon />
        </Button>
      ) : (
        <SmallActionButtons
          className="absolute -right-[16px] bottom-0"
          crossClassName="rounded-l-md rounded-es-none border-l-1"
          checkClassName="rounded-se-none"
          isCheckBtnDisabled={requireNoteForSave && (!currentNote || currentNote.length === 0)}
          onCrossClick={handleCancel}
          onCheckClick={handleSave}
        />
      )}
    </div>
  );
};

/**
 * Wrapper component that combines EncounterUpdateField with DiagnosisCodeNoteField
 * Handles individual saving of diagnosis code notes to the API
 */
const DiagnosisCodeNoteFieldWithUpdate = <T,>({
  value,
  valueToUpdatePayload,
  originalNote,
  currentNote,
  onChange,
  onSaveSuccess,
  onCancel,
  requireNoteForSave = false,
}: {
  value: T;
  valueToUpdatePayload: (value: T) => EHR.UpdateEncounterParams;
  originalNote?: string;
  currentNote: string;
  onChange: (note: string) => void;
  onSaveSuccess: () => void;
  onCancel: () => void;
  requireNoteForSave?: boolean;
}) => {
  return (
    <EncounterUpdateField<T>
      value={value}
      canUpdateParam={DIAGNOSIS_CODES_NOTES_CAN_UPDATE_PARAM}
      valueToUpdatePayload={valueToUpdatePayload}
      render={({ field }) => (
        <DiagnosisCodeNoteField
          originalNote={originalNote}
          currentNote={currentNote}
          onChange={onChange}
          onSave={() => {
            field.onChange(value);
            onSaveSuccess();
          }}
          onCancel={onCancel}
          disabled={field.disabled}
          requireNoteForSave={requireNoteForSave}
        />
      )}
    />
  );
};

/**
 * Component to display saved diagnosis codes from the encounter
 * Each code has an editable note field with individual save functionality
 * Note changes can be saved individually or via "Push all to EHR"
 */
const SavedDiagnosisCodesList = ({
  diagnosisCodes,
  formCodeUpdates,
  onNoteChange,
}: {
  diagnosisCodes: DiagnosisCodeWithNote[];
  formCodeUpdates: Map<string, FormDiagnosisCode>;
  onNoteChange: (code: DiagnosisCodeWithNote, note: string) => void;
}) => {
  if (diagnosisCodes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-4">
      {diagnosisCodes.map((item, index) => {
        // Check if there's an updated note in form control
        const formUpdate = formCodeUpdates.get(item.code);
        // Current note value is only from form updates, not from saved note
        const currentNote = formUpdate?.note ?? '';

        return (
          <div key={index} className="border rounded-md p-3">
            {/* Display diagnosis code and description */}
            <div className="mb-2">
              <p className="text-sm font-semibold">
                {item.code} - {item.description}
              </p>
            </div>

            {/* Editable note field with individual save functionality */}
            <div className="mt-2">
              <DiagnosisCodeNoteFieldWithUpdate
                value={currentNote || item.note}
                valueToUpdatePayload={(noteValue) =>
                  createDiagnosisCodesUpdatePayload(
                    createDiagnosisCodeEntry(
                      item.code,
                      item.description || '',
                      noteValue || undefined,
                    ),
                  )
                }
                originalNote={item.note}
                currentNote={currentNote}
                onChange={(newNote) => onNoteChange(item, newNote)}
                onSaveSuccess={() => {
                  // Clear the updated note after successful save
                  onNoteChange(item, '');
                }}
                onCancel={() => {
                  // Clear the updated note (reset to empty)
                  onNoteChange(item, '');
                }}
                requireNoteForSave={true}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Component to display new diagnosis codes (not yet saved to encounter)
 * Each code has an editable note field with individual save functionality
 */
const NewDiagnosisCodesList = ({
  newCodes,
  onNoteChange,
  onRemoveCode,
}: {
  newCodes: FormDiagnosisCode[];
  onNoteChange: (codeId: string, note: string) => void;
  onRemoveCode: (codeId: string) => void;
}) => {
  if (newCodes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      {newCodes.map((code, index) => (
        <div key={index} className="border rounded-md p-3 bg-blue-50">
          {/* Display code and description */}
          <div className="mb-2">
            <p className="text-sm font-semibold">
              {code.id} - {code.label}
            </p>
          </div>

          {/* Editable note field with save/cancel buttons */}
          <div className="mt-2">
            <DiagnosisCodeNoteFieldWithUpdate
              value={code}
              valueToUpdatePayload={(item) =>
                createDiagnosisCodesUpdatePayload(
                  createDiagnosisCodeEntry(item.id, item.label, item.note),
                )
              }
              currentNote={code.note || ''}
              onChange={(newNote) => onNoteChange(code.id, newNote)}
              onSaveSuccess={() => {
                // Remove code from form control after successful save
                onRemoveCode(code.id);
              }}
              onCancel={() => {
                // Clear the note
                onNoteChange(code.id, '');
              }}
              requireNoteForSave={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Assessment component - manages diagnosis codes and general notes
 * Uses form control fields: diagnosisCodes and assessmentGeneralNotes
 */
export const EncounterAssessment = () => {
  const { control, setValue } = useEncounterFormContext();
  const { encounter } = useVimOSEncounter();
  const { assessment } = encounter || {};

  // ============================================================================
  // STATE AND MEMOIZED VALUES
  // ============================================================================

  // Watch the diagnosisCodes field from form control using useWatch hook
  const watchedDiagnosisCodes = useWatch({ control, name: 'diagnosisCodes' });
  const formDiagnosisCodes = useMemo(() => watchedDiagnosisCodes || [], [watchedDiagnosisCodes]);

  // Saved diagnosis codes from the API - memoized to prevent unnecessary re-renders
  const savedDiagnosisCodes = useMemo(
    () => assessment?.diagnosisCodes || [],
    [assessment?.diagnosisCodes],
  );

  // Separate new codes from saved code updates
  // New codes: codes in form that are NOT in saved codes
  // Saved code updates: codes in form that ARE in saved codes (editing notes)
  const { newCodes, savedCodeIds } = useMemo(() => {
    const savedIds = new Set(savedDiagnosisCodes.map((code) => code.code));
    const newCodesArray = formDiagnosisCodes.filter(
      (code: FormDiagnosisCode) => !savedIds.has(code.id),
    );
    return { newCodes: newCodesArray, savedCodeIds: savedIds };
  }, [formDiagnosisCodes, savedDiagnosisCodes]);

  // Create a map of form updates for saved codes
  const formCodeUpdatesMap = useMemo(() => {
    const map = new Map<string, FormDiagnosisCode>();
    formDiagnosisCodes.forEach((code: FormDiagnosisCode) => {
      if (code.note) {
        map.set(code.id, code);
      }
    });
    return map;
  }, [formDiagnosisCodes]);

  // Get currently selected options for the multi-select field (only new codes)
  const selectedOptions = useMemo(
    () =>
      newCodes.map(
        (code: FormDiagnosisCode): FormDiagnosisCode => ({
          id: code.id,
          label: code.label,
        }),
      ),
    [newCodes],
  );

  // All available diagnosis codes (no filtering)
  // Saved codes will be shown as disabled in the dropdown
  const availableOptions = useMemo(() => {
    return DEFAULT_DIAGNOSIS_CODES;
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Clear form control when NEW codes are saved to API
  // Don't auto-remove saved code updates - let the user manage them
  useEffect(() => {
    if (formDiagnosisCodes.length > 0 && savedDiagnosisCodes.length > 0) {
      const savedCodeIds = new Set(savedDiagnosisCodes.map((code) => code.code));

      // Only filter out NEW codes that have now been saved
      // Keep saved code updates in the form (don't auto-remove them)
      const remainingCodes = formDiagnosisCodes.filter(
        (formCode: { id: string; label: string; note?: string }) => {
          const isSavedCode = savedCodeIds.has(formCode.id);

          // Keep all saved code updates (user is editing existing codes)
          if (isSavedCode) {
            return true;
          }

          // For new codes, check if they've been saved
          // If the code now exists in saved codes with the same note, remove it
          const savedCode = savedDiagnosisCodes.find((sc) => sc.code === formCode.id);
          if (savedCode) {
            const formNote = formCode.note || '';
            const savedNote = savedCode.note || '';
            // Only remove if it's a perfect match (saved successfully)
            return formNote !== savedNote;
          }

          // Keep new codes that aren't saved yet
          return true;
        },
      );

      // Update form control if anything was removed
      if (remainingCodes.length !== formDiagnosisCodes.length) {
        setValue('diagnosisCodes', remainingCodes.length > 0 ? remainingCodes : null);
      }
    }
  }, [savedDiagnosisCodes, formDiagnosisCodes, setValue]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles changes to the multi-select dropdown
   * Updates the form control with newly selected codes while preserving saved code updates
   */
  const handleSelectionChange = useCallback(
    (selected: FormDiagnosisCode[]) => {
      // Convert selected options to form format
      const newFormCodes: FormDiagnosisCode[] = selected.map((option) => {
        // Preserve existing note if the code was already selected
        const existingCode = formDiagnosisCodes.find(
          (code: FormDiagnosisCode) => code.id === option.id,
        );
        return {
          id: option.id,
          label: option.label,
          note: existingCode?.note || '',
        };
      });

      // Get saved code updates from form control
      const savedCodeUpdates = formDiagnosisCodes.filter((code: FormDiagnosisCode) => {
        const savedCodeIds = new Set(savedDiagnosisCodes.map((sc) => sc.code));
        return savedCodeIds.has(code.id);
      });

      // Combine new codes with saved code updates
      const allCodes = [...savedCodeUpdates, ...newFormCodes];

      // Update form control and mark as dirty to enable "Push all to EHR" button
      setValue('diagnosisCodes', allCodes, { shouldDirty: true });
    },
    [formDiagnosisCodes, savedDiagnosisCodes, setValue],
  );

  /**
   * Handles note updates for a specific diagnosis code (new codes only)
   * Updates the note in the form control while preserving saved code updates
   */
  const handleNoteChange = useCallback(
    (codeId: string, noteValue: string) => {
      const updatedCodes = formDiagnosisCodes.map((code: FormDiagnosisCode) => {
        if (code.id === codeId) {
          return { ...code, note: noteValue };
        }
        return code;
      });
      // Update form control and mark as dirty to enable "Push all to EHR" button
      setValue('diagnosisCodes', updatedCodes, { shouldDirty: true });
    },
    [formDiagnosisCodes, setValue],
  );

  /**
   * Handles note updates for saved diagnosis codes
   * Adds/updates the code in form control to track the change
   * Removes the code if the note is empty (no change to save)
   */
  const handleSavedCodeNoteChange = useCallback(
    (savedCode: DiagnosisCodeWithNote, noteValue: string) => {
      // If note is empty, remove this saved code from form control
      if (!noteValue || noteValue.trim().length === 0) {
        const updatedCodes = formDiagnosisCodes.filter(
          (code: FormDiagnosisCode) => code.id !== savedCode.code,
        );
        setValue('diagnosisCodes', updatedCodes.length > 0 ? updatedCodes : null, {
          shouldDirty: updatedCodes.length > 0,
        });
        return;
      }

      // Check if this code is already in the form control
      const existingIndex = formDiagnosisCodes.findIndex(
        (code: FormDiagnosisCode) => code.id === savedCode.code,
      );

      let updatedCodes: FormDiagnosisCode[];
      if (existingIndex >= 0) {
        // Update existing entry
        updatedCodes = formDiagnosisCodes.map((code: FormDiagnosisCode, index: number) => {
          if (index === existingIndex) {
            return { ...code, note: noteValue };
          }
          return code;
        });
      } else {
        // Add new entry for this saved code
        updatedCodes = [
          ...formDiagnosisCodes,
          {
            id: savedCode.code,
            label: savedCode.description || '',
            note: noteValue,
          },
        ];
      }

      // Update form control and mark as dirty
      setValue('diagnosisCodes', updatedCodes, { shouldDirty: true });
    },
    [formDiagnosisCodes, setValue],
  );

  /**
   * Removes a code from form control after individual save
   */
  const handleRemoveCodeFromForm = useCallback(
    (codeId: string) => {
      const updatedCodes = formDiagnosisCodes.filter((c: FormDiagnosisCode) => c.id !== codeId);
      setValue('diagnosisCodes', updatedCodes.length > 0 ? updatedCodes : null, {
        shouldDirty: updatedCodes.length > 0,
      });
    },
    [formDiagnosisCodes, setValue],
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Clear form control when NEW codes are saved to API
  // Don't auto-remove saved code updates - let the user manage them
  useEffect(() => {
    if (formDiagnosisCodes.length > 0 && savedDiagnosisCodes.length > 0) {
      const savedCodeIds = new Set(savedDiagnosisCodes.map((code) => code.code));

      // Only filter out NEW codes that have now been saved
      // Keep saved code updates in the form (don't auto-remove them)
      const remainingCodes = formDiagnosisCodes.filter(
        (formCode: { id: string; label: string; note?: string }) => {
          const isSavedCode = savedCodeIds.has(formCode.id);

          // Keep all saved code updates (user is editing existing codes)
          if (isSavedCode) {
            return true;
          }

          // For new codes, check if they've been saved
          // If the code now exists in saved codes with the same note, remove it
          const savedCode = savedDiagnosisCodes.find((sc) => sc.code === formCode.id);
          if (savedCode) {
            const formNote = formCode.note || '';
            const savedNote = savedCode.note || '';
            // Only remove if it's a perfect match (saved successfully)
            return formNote !== savedNote;
          }

          // Keep new codes that aren't saved yet
          return true;
        },
      );

      // Update form control if anything was removed
      if (remainingCodes.length !== formDiagnosisCodes.length) {
        setValue('diagnosisCodes', remainingCodes.length > 0 ? remainingCodes : null);
      }
    }
  }, [savedDiagnosisCodes, formDiagnosisCodes, setValue]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <EntitySectionTitle title="Assessment" />
      <EntitySectionContent>
        {/* Saved diagnosis codes section */}
        <EntityFieldContent>
          <SavedDiagnosisCodesList
            diagnosisCodes={savedDiagnosisCodes}
            formCodeUpdates={formCodeUpdatesMap}
            onNoteChange={handleSavedCodeNoteChange}
          />

          {/* Multi-select dropdown for adding new diagnosis codes */}
          {/* EncounterUpdateField wrapper enables bulk save via check button */}
          <EncounterUpdateField<FormDiagnosisCode[]>
            value={formDiagnosisCodes}
            canUpdateParam={DIAGNOSIS_CODES_CAN_UPDATE_PARAM}
            valueToUpdatePayload={(items) =>
              createDiagnosisCodesUpdatePayload(
                items.map((item) => createDiagnosisCodeEntry(item.id, item.label, item.note)),
              )
            }
            render={({ field }) => (
              <DiagnosisMultiSelectField<FormDiagnosisCode[]>
                placeholder="Add ICD-10"
                includeOptionsFields
                formatOption={(option) => `${option.id} - ${option.label}`}
                selectedOptions={selectedOptions}
                onSelectedChange={handleSelectionChange}
                options={availableOptions}
                disabledOptionIds={savedCodeIds}
                disabled={field.disabled}
                onChange={() => {
                  // Bulk save: Submit only NEW codes to API
                  // Saved code updates go via "Push all to EHR" button
                  field.onChange(newCodes);
                }}
              />
            )}
          />
        </EntityFieldContent>

        {/* New diagnosis codes section */}
        <NewDiagnosisCodesList
          newCodes={newCodes}
          onNoteChange={handleNoteChange}
          onRemoveCode={handleRemoveCodeFromForm}
        />

        {/* General notes section */}
        <EntityFieldContent>
          <EntityFieldTitle title="General notes" />
          <EncounterUpdateField<string | undefined>
            canUpdateParam={GENERAL_NOTES_CAN_UPDATE_PARAM}
            valueToUpdatePayload={(value) => ({
              assessment: {
                generalNotes: value,
              },
            })}
            render={({ field }) => (
              <TextareaField<FormInputs>
                placeholder="Add notes here"
                control={control}
                name="assessmentGeneralNotes"
                onTextareaSubmit={field.onChange}
                disabled={field.disabled}
                clearAfterChange
                prefixAdornment={assessment?.generalNotes}
              />
            )}
          />
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
