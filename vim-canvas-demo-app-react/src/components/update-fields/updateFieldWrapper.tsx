import { useVimOsContext } from "@/hooks/useVimOsContext";
import { UpdateField } from "./types";
import { EHR } from "vim-os-js-browser/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useVimOSReferral } from "@/hooks/useReferral";
import { useToast } from "@/hooks/use-toast";
import { useVimOSEncounter } from "@/hooks/useEncounter";

export interface UpdateFieldProps<
  T = unknown,
  CAN_UPDATE extends () => boolean = () => boolean,
  VAL_TO_UPDATE extends (value: T) => Promise<unknown> = (
    value: T
  ) => Promise<unknown>
> {
  entity: unknown;
  value?: T;
  canUpdate: CAN_UPDATE;
  updateOnNewValue: VAL_TO_UPDATE;
  toastSuccessTitle?: string;

  render: (props: { field: UpdateField<T> }) => JSX.Element;
}

function EntityUpdateField<
  T,
  CAN_UPDATE extends () => boolean,
  VAL_TO_UPDATE extends (value: T) => Promise<unknown>
>({
  entity,
  value,
  updateOnNewValue,
  render,
  canUpdate,
  toastSuccessTitle,
}: UpdateFieldProps<T, CAN_UPDATE, VAL_TO_UPDATE>) {
  const { toast } = useToast();
  const [canUpdateField, setCanUpdateField] = useState(false);

  useEffect(() => {
    if (entity) {
      setCanUpdateField(canUpdate());
    }
  }, [canUpdate, entity]);

  const onChange = useCallback(
    (newValue: T) => {
      updateOnNewValue(newValue)
        .then(() => {
          toast({
            variant: "default",
            title: toastSuccessTitle,
          });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error ? JSON.stringify(error) : "An error occurred.",
          });
        });
    },
    [toast, toastSuccessTitle, updateOnNewValue]
  );

  const renderData = useMemo(
    () => ({
      field: {
        value,
        disabled: !canUpdateField,
        onChange,
      },
    }),
    [value, canUpdateField, onChange]
  );

  return render(renderData);
}

type ReferralUpdateFieldProps<T = unknown> = Pick<
  UpdateFieldProps<T>,
  "render" | "value"
> & {
  canUpdateParam: EHR.CanUpdateReferralParams;
  valueToUpdatePayload: (value: T) => EHR.UpdateReferralParams;
};

export function ReferralUpdateField<T = unknown>({
  value,
  valueToUpdatePayload,
  render,
  canUpdateParam,
}: ReferralUpdateFieldProps<T>) {
  const vimOS = useVimOsContext();
  const referral = useVimOSReferral();

  return (
    <EntityUpdateField
      canUpdate={() =>
        vimOS.ehr.resourceUpdater.canUpdateReferral(canUpdateParam).canUpdate
      }
      updateOnNewValue={(newValue) =>
        vimOS.ehr.resourceUpdater.updateReferral(valueToUpdatePayload(newValue))
      }
      entity={referral}
      render={render}
      value={value}
      toastSuccessTitle="Referral updated!"
    />
  );
}

type EncounterUpdateFieldProps<T = unknown> = Pick<
  UpdateFieldProps<T>,
  "render" | "value"
> & {
  canUpdateParam: EHR.CanUpdateEncounterParams;
  valueToUpdatePayload: (value: T) => EHR.UpdateEncounterParams;
};

export function EncounterUpdateField<T = unknown>({
  value,
  valueToUpdatePayload,
  render,
  canUpdateParam,
}: EncounterUpdateFieldProps<T>) {
  const vimOS = useVimOsContext();
  const encounter = useVimOSEncounter();

  return (
    <EntityUpdateField
      canUpdate={() => {
        return vimOS.ehr.resourceUpdater.canUpdateEncounter(canUpdateParam).canUpdate;
      }}
      updateOnNewValue={(newValue) =>
        vimOS.ehr.resourceUpdater.updateEncounter(
          valueToUpdatePayload(newValue)
        )
      }
      toastSuccessTitle="Encounter updated!"
      entity={encounter}
      render={render}
      value={value}
    />
  );
}
