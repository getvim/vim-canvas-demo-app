import { useVimOsContext } from "@/hooks/useVimOsContext";
import { UpdateField } from "./types";
import { EHR } from "vim-os-js-browser/types";
import { useEffect, useState } from "react";
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
      console.info("### canUpdateResult", canUpdateResult);
      setCanUpdateField(canUpdateResult.canUpdate);
    }
  }, [canUpdateParam, referral, vimOS.ehr.resourceUpdater]);

  return render({
    field: {
      value,
      disabled: !canUpdateField,
      onChange: (newValue) => {
        vimOS.ehr.resourceUpdater
          .updateReferral(valueToUpdatePayload(newValue))
          .then(() => {
            toast({
              variant: "default",
              title: "Referral updated!",
            });
          })
          .catch((error) => {
            console.info("### error", error);
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error ? JSON.stringify(error) : "An error occurred.",
            });
          });
      },
    },
  });
}
