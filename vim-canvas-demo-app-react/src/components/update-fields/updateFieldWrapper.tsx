import { useVimOsContext } from "@/hooks/useVimOsContext";
import { UpdateField } from "./types";
import { EHR } from "vim-os-js-browser/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useVimOSReferral } from "@/hooks/useReferral";
import { useToast } from "@/hooks/use-toast";

export interface UpdateFieldProps<T = unknown> {
  value: T;
  canUpdateParam: EHR.CanUpdateReferralParams;
  valueToUpdatePayload: (value: T) => EHR.UpdateReferralParams;
  render: (props: { field: UpdateField<T> }) => JSX.Element;
}

export function ReferralUpdateField<T = unknown>({
  value,
  valueToUpdatePayload,
  render,
  canUpdateParam,
}: UpdateFieldProps<T>) {
  const { toast } = useToast();
  const vimOS = useVimOsContext();
  const referral = useVimOSReferral();

  const [canUpdateField, setCanUpdateField] = useState(false);

  useEffect(() => {
    if (referral) {
      const canUpdateResult =
        vimOS.ehr.resourceUpdater.canUpdateReferral(canUpdateParam);
      setCanUpdateField(canUpdateResult.canUpdate);
    }
  }, [canUpdateParam, referral, vimOS.ehr.resourceUpdater]);

  const onChange = useCallback(
    (newValue: T) => {
      vimOS.ehr.resourceUpdater
        .updateReferral(valueToUpdatePayload(newValue))
        .then(() => {
          toast({
            variant: "default",
            title: "Referral updated!",
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
    [toast, valueToUpdatePayload, vimOS.ehr.resourceUpdater]
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
