import { useEffect, useMemo, useState } from "react";
import type { EHR } from "vim-os-js-browser/types";
import { useVimOsContext } from "@/providers/VimOSContext";

const calcIsUpdatable = (
  sectionName: keyof EHR.UpdateEncounterParams,
  priorityList: Partial<Record<keyof EHR.UpdateEncounterParams, string[]>>,
  details: EHR.CanUpdateEncounterParams
) => {
  if (sectionName && priorityList) {
    const section = details[sectionName] || {};
    const priorities = priorityList[sectionName] || [];
    const updatableField = priorities?.find(
      (fieldName) => section[fieldName as keyof typeof section] === true
    );
    
    return updatableField;
  }
};

export const useUpdateEncounterSubscription = <
  T extends keyof EHR.UpdateEncounterParams
>(
  subscriptionParams: EHR.CanUpdateEncounterParams,
  sectionName: T,
  priorityList: Partial<Record<keyof EHR.UpdateEncounterParams, string[]>> // TODO Support Actual Fieldname // Partial<Record<T, Array<keyof EHR.UpdateEncounterParams[T]>>>
) => {
  const vimOS = useVimOsContext();
  const [canUpdateSubscriptionParams, setCanUpdateSubscriptionParams] =
    useState<boolean>(false);
  const [subscriptionUpdatableField, setSubscriptionUpdatableField] =
    useState<string>();

  useEffect(() => {
    const onUpdate = () => {
      if (subscriptionParams) {
        const { details } =
          vimOS.ehr.resourceUpdater.canUpdateEncounter(subscriptionParams);
        if (sectionName && priorityList) {
          const updatableField = calcIsUpdatable(
            sectionName,
            priorityList,
            details
          );
          const canUpdate = updatableField !== undefined;
          setCanUpdateSubscriptionParams(canUpdate);
          setSubscriptionUpdatableField(updatableField);
        }
      }
    };

    vimOS.ehr.resourceUpdater.subscribe("encounter", onUpdate);

    return () => vimOS.ehr.resourceUpdater.unsubscribe("encounter", onUpdate);
  }, [
    priorityList,
    sectionName,
    subscriptionParams,
    vimOS.ehr.resourceUpdater,
  ]);

  // Expose flag, field to update & update function
  return useMemo(
    () => ({
      canUpdateSubscriptionParams,
      subscriptionUpdatableField,
      updateSubscriptionField: (content: string) => {
        if (!sectionName || !canUpdateSubscriptionParams) {
          return;
        }

        vimOS.ehr.resourceUpdater
          .updateEncounter({
            [sectionName]: {
              [subscriptionUpdatableField as string]: content,
            },
          })
          .then(() => {
            console.log({
              variant: "default",
              title: "Encounter notes updated!",
            });
          })
          .catch((error) => {
            console.log({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              sectionName,
              subscriptionUpdatableField,
              description: error ? JSON.stringify(error) : "An error occurred.",
            });
          });
      },
    }),
    [
      canUpdateSubscriptionParams,
      sectionName,
      subscriptionUpdatableField,
      vimOS.ehr.resourceUpdater,
    ]
  );
};

export const useUpdateEncounter = () => {
  const vimOS = useVimOsContext();

  return useMemo(
    () => ({
      // Direct API call to update encounter notes
      checkCanUpdate: vimOS.ehr.resourceUpdater.canUpdateEncounter,
      updateEncounter: (payload: EHR.UpdateEncounterParams) =>
        vimOS.ehr.resourceUpdater
          .updateEncounter(payload)
          .then(() => {
            console.log({
              variant: "default",
              title: "Encounter notes updated!",
            });
          })
          .catch((error) => {
            console.log({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error ? JSON.stringify(error) : "An error occurred.",
            });
          }),
    }),
    [vimOS.ehr.resourceUpdater]
  );
};
