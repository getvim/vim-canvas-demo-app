/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from "@/components/update-fields/datePicker";
import { ReferralUpdateField } from "@/components/update-fields/updateFieldWrapper";
import { useVimOSReferral } from "@/hooks/useReferral";
import { format } from "date-fns";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
} from "../ui/entityContent";
import { InputField } from "../update-fields/inputField";
import { SelectField } from "../update-fields/selectField";
import targetSpecialtiesJson from "./targetSpecialties.json";
import priorityOptions from "./priorities.json";
import { ReferralFormInputs, useReferralFormContext } from "./referral.form";
import { TextareaField } from "../update-fields/textAreaField";
import { useController } from "react-hook-form";

targetSpecialtiesJson.sort((a, b) => a.label.localeCompare(b.label));

export const ReferralBasicInformation = () => {
  const { referral } = useVimOSReferral();
  const { control } = useReferralFormContext();

  const { field: specialtyField } = useController({
    name: "specialty",
    control,
    defaultValue: referral?.basicInformation?.specialty || null,
  });

  const { field: startDateField } = useController({
    name: "startDate",
    control,
    defaultValue: referral?.basicInformation?.startDate || null,
  });

  const { field: endDateField } = useController({
    name: "endDate",
    control,
    defaultValue: referral?.basicInformation?.endDate || null,
  });

  const { field: priorityField } = useController({
    name: "priority",
    control,
    defaultValue: referral?.basicInformation?.priority || null,
  });

  const { field: numberOfVisitsField } = useController({
    name: "numberOfVisits",
    control,
    defaultValue: referral?.basicInformation?.numberOfVisits || null,
  });

  return (
    <>
      <EntitySectionContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Speciality" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<{ id?: string; label?: string }>
              value={{ id: referral?.basicInformation?.specialty }}
              canUpdateParam={{
                basicInformation: {
                  specialty: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  specialty: value?.label,
                },
              })}
              render={({ field }) => (
                <SelectField
                  valueName="label"
                  selectedValue={field.value?.id}
                  includeOptionsFields
                  placeholder="Select speciality"
                  options={targetSpecialtiesJson}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  onSelectedChange={(value) => {
                    specialtyField.onChange(value?.label || null);
                  }}
                  disabled={field.disabled}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Start date" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
              value={referral?.basicInformation?.startDate}
              canUpdateParam={{
                basicInformation: {
                  startDate: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  startDate: value,
                },
              })}
              render={({ field: { value, onChange, ...field } }) => (
                <DatePicker
                  value={value}
                  onChange={(date) => {
                    const dateString = date
                      ? format(date, "yyyy-MM-dd")
                      : undefined;
                    onChange(dateString);
                  }}
                  onDateChange={(date) => {
                    const dateString = date ? format(date, "yyyy-MM-dd") : null;
                    startDateField.onChange(dateString);
                  }}
                  {...field}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="End date" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
              value={referral?.basicInformation?.endDate}
              canUpdateParam={{
                basicInformation: {
                  endDate: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  endDate: value,
                },
              })}
              render={({ field: { value, onChange, ...field } }) => (
                <DatePicker
                  value={value}
                  onChange={(date) => {
                    const dateString = date
                      ? format(date, "yyyy-MM-dd")
                      : undefined;
                    onChange(dateString);
                  }}
                  onDateChange={(date) => {
                    const dateString = date ? format(date, "yyyy-MM-dd") : null;
                    endDateField.onChange(dateString);
                  }}
                  {...field}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Created at" />
          <EntityFieldReadonlyText
            text={referral?.basicInformation?.createdDate}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Status" />
          <EntityFieldReadonlyText text={referral?.basicInformation?.status} />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Priority" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<{ id?: string }>
              value={{ id: referral?.basicInformation?.priority }}
              canUpdateParam={{
                basicInformation: {
                  priority: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  priority: value?.id as any,
                },
              })}
              render={({ field }) => (
                <SelectField
                  selectedValue={field.value?.id?.toUpperCase()}
                  includeOptionsFields
                  placeholder="Select priority"
                  options={priorityOptions}
                  onChange={(value: { id?: string; label?: string } | null) => {
                    field.onChange(
                      value ? { id: value.id } : { id: undefined }
                    );
                  }}
                  onSelectedChange={(value) => {
                    priorityField.onChange(value?.id || null);
                  }}
                  disabled={field.disabled}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Auth code" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
              value={referral?.basicInformation?.authCode}
              canUpdateParam={{
                basicInformation: {
                  authCode: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  authCode: value,
                },
              })}
              render={({ field }) => (
                <TextareaField<ReferralFormInputs>
                  placeholder="Enter auth code"
                  control={control}
                  name="authCode"
                  onTextareaSubmit={field.onChange}
                  disabled={field.disabled}
                  clearAfterChange
                  prefixAdornment={referral?.basicInformation?.authCode}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Is locked" />
          <EntityFieldReadonlyText
            text={
              referral?.basicInformation?.isLocked === undefined
                ? undefined
                : referral?.basicInformation?.isLocked
                ? "Yes"
                : "No"
            }
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Reasons" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
              value={referral?.basicInformation?.reasons?.[0]}
              canUpdateParam={{
                basicInformation: {
                  reasons: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  reasons: value ? [value] : [],
                },
              })}
              render={({ field }) => (
                <TextareaField<ReferralFormInputs>
                  placeholder="Enter reasons"
                  control={control}
                  name="reasons"
                  onTextareaSubmit={field.onChange}
                  disabled={field.disabled}
                  clearAfterChange
                  prefixAdornment={referral?.basicInformation?.reasons?.[0]}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Notes" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
              value={referral?.basicInformation?.notes || ""}
              canUpdateParam={{
                basicInformation: {
                  notes: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  notes: value,
                },
              })}
              render={({ field }) => (
                <TextareaField<ReferralFormInputs>
                  placeholder="Enter notes"
                  control={control}
                  name="notes"
                  onTextareaSubmit={field.onChange}
                  disabled={field.disabled}
                  clearAfterChange
                  prefixAdornment={referral?.basicInformation?.notes}
                />
              )}
            />
          </div>
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Facility name" />
          <EntityFieldReadonlyText
            text={referral?.basicInformation?.facilityName}
          />
        </EntityFieldContent>
        <EntityFieldContent>
          <EntityFieldTitle title="Number of visits" />
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<number | undefined>
              value={referral?.basicInformation?.numberOfVisits}
              canUpdateParam={{
                basicInformation: {
                  numberOfVisits: true,
                },
              }}
              valueToUpdatePayload={(value) => ({
                basicInformation: {
                  numberOfVisits: value,
                },
              })}
              render={({ field: { onChange, value, ...field } }) => (
                <InputField
                  {...field}
                  min={0}
                  inputType="number"
                  value={value?.toString() || ""}
                  onChange={(numberOfVisitsString) => {
                    onChange(
                      numberOfVisitsString
                        ? parseInt(numberOfVisitsString)
                        : undefined
                    );
                  }}
                  onInputChange={(numberOfVisitsString) => {
                    const numValue = numberOfVisitsString
                      ? parseInt(numberOfVisitsString)
                      : undefined;
                    numberOfVisitsField.onChange(numValue || null);
                  }}
                />
              )}
            />
          </div>
        </EntityFieldContent>
      </EntitySectionContent>
    </>
  );
};
