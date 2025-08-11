import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSEncounter } from "@/hooks/useEncounter";
import { useUpdateEncounter } from "@/hooks/useUpdateEncounter";
import { FormProvider, useWatch } from "react-hook-form";
import { EHR } from "vim-os-js-browser/types";
import { ProviderSection } from "../Provider";
import { Button } from "../ui/button";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionTitle,
} from "../ui/entityContent";
import { EncounterAssessment } from "./Assessment";
import { EncounterBasicInformation } from "./BasicInformation";
import { FormInputs, useEncounterForm } from "./encounter.form";
import { EncounterObjective } from "./Objective";
import { EncounterPI } from "./PatientInstructions";
import { EncounterPlan } from "./Plan";
import { EncounterSubjective } from "./Subjective";
import { EncounterBillingInformation } from "./BillingInformation";
import { EncounterGeneralNotes } from "./EncounterNotes";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  FORM_DATA_TO_VIM_OS_PATH_MAPPING,
  prepareResetFields,
  buildEncounterPayload,
} from "./encounter.helpers";
import { set, isEmpty } from "lodash-es";

const scrollY = 530;

export const EncounterContent = () => {
  const { toast } = useToast();
  const { jsonMode } = useAppConfig();

  const { encounter } = useVimOSEncounter();
  const { canUpdate, updateEncounter } = useUpdateEncounter();

  const formProps = useEncounterForm();
  const watchedFields = useWatch({
    control: formProps.control,
  });

  const [enlargedHeader, setEnlargeHeader] = useState(false);
  const [areFieldsDirty, setAreFieldsDirty] = useState(false);

  /**
   * Because input fields are never disabled (because when they can't be updated we show copy to clipboard UX),
   * We can't use react-hook-form to determine which inputs are for copy to clipboard and which are for updating.
   *
   * So we have to manually check if the input fields are dirty and if they can be updated.
   */
  const canUpdateObj: EHR.CanUpdateEncounterParams = useMemo(
    () => ({
      assessment: {},
      objective: {},
      patientInstructions: {},
      plan: {},
      subjective: {},
      billingInformation: {},
      encounterNotes: {},
    }),
    []
  );

  useEffect(() => {
    const changedFields = Object.keys(formProps.formState.dirtyFields);
    if (changedFields.length > 0) {
      changedFields.forEach((key) => {
        const fieldPath =
          FORM_DATA_TO_VIM_OS_PATH_MAPPING[key as keyof FormInputs];
        if (fieldPath) {
          set(canUpdateObj, fieldPath, true);
        }
      });
    }
  }, [formProps.formState.dirtyFields, canUpdateObj, watchedFields]);

  useEffect(() => {
    const dirtyFields = formProps.formState.dirtyFields;

    const hasDirtyFieldsWithValues = Object.keys(dirtyFields).some(
      (fieldName) => {
        const fieldValue = watchedFields[fieldName as keyof FormInputs];
        return !isEmpty(fieldValue);
      }
    );

    setAreFieldsDirty(hasDirtyFieldsWithValues);
  }, [watchedFields, formProps.formState.dirtyFields]);

  const canUpdateResult = canUpdate(canUpdateObj);

  const canUpdateNotes = {
    ...canUpdateResult,
    canUpdate: areFieldsDirty && canUpdateResult.canUpdate,
  };

  const onEncounterSubmit = async (data: FormInputs) => {
    const encounterPayload = buildEncounterPayload(data, canUpdateNotes);
    console.log("encounterPayload", Object.keys(encounterPayload));

    updateEncounter(encounterPayload)
      .then(() => {
        toast({
          variant: "default",
          title: "Encounter notes updated!",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error ? JSON.stringify(error) : "An error occurred.",
        });
      });

    formProps.reset(prepareResetFields(canUpdateNotes));
  };

  const headerClasses = useMemo(() => {
    return `flex justify-between items-center top-0 z-[100] bg-white  p-2  duration-2 ${
      enlargedHeader
        ? " animate-[fadeIn_0.2s_forwards] opacity-0 pr-6 pl-4 fixed top-0  left-0 pt-0  w-full shadow-md"
        : ""
    }`;
  }, [enlargedHeader]);

  const checkIfNeedToSetStickyHeader = useCallback(() => {
    setEnlargeHeader(window.scrollY > scrollY);
  }, [setEnlargeHeader]);

  const onScroll = useCallback(() => {
    checkIfNeedToSetStickyHeader();
  }, [checkIfNeedToSetStickyHeader]);

  useEffect(() => {
    checkIfNeedToSetStickyHeader();
    return () => {
      setEnlargeHeader(false);
    };
  }, [checkIfNeedToSetStickyHeader, setEnlargeHeader]);

  useLayoutEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div className="w-full">
      {jsonMode ? (
        <JSONView value={encounter} />
      ) : (
        <>
          <EntitySectionTitle title="Identifiers" />
          <EntityFieldContent>
            <EntityFieldTitle title="EHR Encounter ID" />
            <EntityFieldReadonlyText
              text={encounter?.identifiers?.ehrEncounterId}
            />
          </EntityFieldContent>
          <Separator className="mb-1" />
          <EncounterBasicInformation />
          <Separator className="mb-1" />
          <FormProvider {...formProps}>
            <form onSubmit={formProps.handleSubmit(onEncounterSubmit)}>
              <div className={headerClasses}>
                <EntitySectionTitle className="text-md" title="SOAP" />
                <Button
                  size="sm"
                  variant="default"
                  className="pl-3 pr-3 h-8"
                  disabled={!canUpdateNotes?.canUpdate}
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    formProps.handleSubmit(onEncounterSubmit)();
                  }}
                >
                  Push all to EHR
                </Button>
              </div>
              <EncounterSubjective />
              <Separator className="mb-1" />
              <EncounterObjective />
              <Separator className="mb-1" />
              <EncounterAssessment />
              <Separator className="mb-1" />
              <EncounterPlan />
              <Separator className="mb-1" />
              <EncounterPI />
              <Separator className="mb-1" />
              <EncounterBillingInformation />
              <Separator className="mb-1" />
              <EncounterGeneralNotes />
            </form>
          </FormProvider>
          <Separator className="mb-1" />
          <ProviderSection provider={encounter?.provider} title="Provider" />
        </>
      )}
    </div>
  );
};
