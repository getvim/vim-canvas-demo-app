/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from "@/components/update-fields/datePicker";
import { ReferralUpdateField } from "@/components/update-fields/updateFieldWrapper";
import { useVimOSReferral } from "@/hooks/useReferral";
import { format, parseISO } from "date-fns";
import { InputField } from "../update-fields/inputField";
import { SelectField } from "../update-fields/selectField";

export const ReferralBasicInformation = () => {
  const { referral } = useVimOSReferral();

  return (
    <>
      <h2 className="my-3 text-sm font-bold">Basic Information</h2>
      <div className="mb-2 px-2">
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Start date</h3>
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
                  value={value ? parseISO(value) : undefined}
                  onChange={(date) =>
                    onChange(date ? format(date, "yyyy-MM-dd") : date)
                  }
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">End date</h3>
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
                  value={value ? parseISO(value) : undefined}
                  onChange={(date) =>
                    onChange(date ? format(date, "yyyy-MM-dd") : date)
                  }
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Created at</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              {referral?.basicInformation?.createdDate ?? "--"}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Priority</h3>
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
                  priority: value.id as any,
                },
              })}
              render={({ field }) => (
                <SelectField
                  valueId={field.value.id?.toUpperCase()}
                  includeOptionsFields
                  placeholder="Select priority"
                  options={[
                    { id: "ROUTINE", label: "Routine" },
                    { id: "URGENT", label: "Urgent" },
                    { id: "STAT", label: "Stat" },
                  ]}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Status</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              {referral?.basicInformation?.status ?? "--"}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Speciality</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              {referral?.basicInformation?.specialty ?? "--"}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Auth code</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              {referral?.basicInformation?.authCode ?? "--"}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Facility name</h3>
          <div className="mt-2">
            <p className="font-thin text-xs">
              <p className="font-thin text-xs">
                {referral?.basicInformation?.facilityName ?? "--"}
              </p>
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Number of visits</h3>
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
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
              render={({ field }) => <InputField {...field} />}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Reasons</h3>
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
              render={({ field }) => <InputField {...field} />}
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xs mt-2 font-semibold">Notes</h3>
          <div className="flex justify-center mt-2">
            <ReferralUpdateField<string | undefined>
              value={referral?.basicInformation?.notes}
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
              render={({ field }) => <InputField {...field} />}
            />
          </div>
        </div>
      </div>
    </>
  );
};
