import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSReferral } from "@/hooks/useReferral";
import { EHR } from "vim-os-js-browser/types";
import { FormProvider, useWatch } from "react-hook-form";
import { ProviderSection } from "../Provider";
import {
  EntityFieldContent,
  EntityFieldReadonlyText,
  EntityFieldTitle,
  EntitySectionContent,
  EntitySectionTitle,
} from "../ui/entityContent";
import { SelectField } from "../update-fields/selectField";
import { ReferralUpdateField } from "../update-fields/updateFieldWrapper";
import { useReferralForm, ReferralFormInputs } from "./referral.form";
import { ReferralBasicInformation } from "./BasicInformation";
import { ReferralConditions } from "./Conditions";
import { ReferralProcedures } from "./Procedures";
import targetProvidersJson from "./targetProviders.json";
import {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useUpdateReferral } from "@/hooks/useUpdateReferral";
import { Button } from "../ui/button";
import {
  buildReferralPayload,
  prepareResetFields,
  hasValue,
  FORM_DATA_TO_VIM_OS_PATH_MAPPING,
} from "./referral.helpers";
import { set } from "lodash-es";

const scrollY = 530;

export const ReferralContent = () => {
  const { toast } = useToast();
  const { jsonMode } = useAppConfig();
  const { referral } = useVimOSReferral();
  const { canUpdate, updateReferral } = useUpdateReferral();
  const formProps = useReferralForm();
  const [enlargedHeader, setEnlargeHeader] = useState(false);

  const [selectedProcedures, setSelectedProcedures] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectedConditions, setSelectedConditions] = useState<
    { id: string; label: string }[]
  >([]);
  const [selectedTargetProvider, setSelectedTargetProvider] = useState<
    EHR.UpdatableProvider | undefined
  >(referral?.targetProvider);
  const [areFieldsDirty, setAreFieldsDirty] = useState(false);

  const watchedFields = useWatch({
    control: formProps.control,
  });

  const canUpdateObj: EHR.CanUpdateReferralParams = useMemo(
    () => ({
      basicInformation: {
        specialty: false,
        startDate: false,
        endDate: false,
        priority: false,
        authCode: false,
        reasons: false,
        notes: false,
        numberOfVisits: false,
      },
      procedureCodes: {
        cpts: false,
      },
      conditions: {
        diagnosis: false,
      },
    }),
    []
  );

  useEffect(() => {
    const changedFields = Object.keys(formProps.formState.dirtyFields);
    if (changedFields.length > 0) {
      changedFields.forEach((key) => {
        const fieldPath =
          FORM_DATA_TO_VIM_OS_PATH_MAPPING[key as keyof ReferralFormInputs];
        if (fieldPath) {
          set(canUpdateObj, fieldPath, true);
        }
      });
    }
  }, [formProps.formState.dirtyFields, canUpdateObj, watchedFields]);

  useEffect(() => {
    const { dirtyFields } = formProps.formState;

    const hasFormContent = Object.keys(dirtyFields).some((field) =>
      hasValue(watchedFields[field as keyof ReferralFormInputs])
    );

    const hasSelections =
      selectedProcedures.length > 0 ||
      selectedConditions.length > 0 ||
      selectedTargetProvider;

    const shouldEnableButton = hasFormContent || hasSelections;
    setAreFieldsDirty(shouldEnableButton);
  }, [
    watchedFields,
    formProps.formState,
    selectedProcedures,
    selectedConditions,
    selectedTargetProvider,
  ]);

  const canUpdateResult = canUpdate(canUpdateObj);

  const canUpdateNotes = {
    ...canUpdateResult,
    canUpdate: areFieldsDirty && canUpdateResult.canUpdate,
  };

  const onReferralSubmit = async (data: ReferralFormInputs) => {
    const referralPayload = buildReferralPayload(
      data,
      selectedProcedures,
      selectedConditions,
      selectedTargetProvider
    );

    updateReferral(referralPayload)
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
      })
      .finally(() => {
        setSelectedProcedures([]);
        setSelectedConditions([]);
        setSelectedTargetProvider();
      });

    formProps.reset(prepareResetFields());
  };

  const headerClasses = useMemo(() => {
    return `flex justify-between items-center top-0 z-[100] bg-white p-0 duration-2 ${
      enlargedHeader
        ? " animate-[fadeIn_0.2s_forwards] opacity-0 pr-6 pl-4 fixed top-0 left-0 pt-0 w-full shadow-md"
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
        <JSONView value={referral} />
      ) : (
        <FormProvider {...formProps}>
          <form onSubmit={formProps.handleSubmit(onReferralSubmit)}>
            <EntitySectionTitle title="Identifiers" />
            <EntitySectionContent>
              <EntityFieldContent>
                <EntityFieldTitle title="EHR referral ID" />
                <EntityFieldReadonlyText
                  text={referral?.identifiers?.ehrReferralId}
                />
              </EntityFieldContent>
              <EntityFieldContent>
                <EntityFieldTitle title="Vim referral ID" />
                <EntityFieldReadonlyText
                  text={referral?.identifiers?.vimReferralId}
                />
              </EntityFieldContent>
            </EntitySectionContent>
            <Separator className="mb-1" />

            <div className={headerClasses}>
              <EntitySectionTitle title="Basic Information" />
              <Button
                size="sm"
                variant="default"
                className="pl-3 pr-3 h-8"
                disabled={!canUpdateNotes?.canUpdate}
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  formProps.handleSubmit(onReferralSubmit)();
                }}
              >
                Push all to EHR
              </Button>
            </div>

            <ReferralBasicInformation />
            <Separator className="mb-1" />

            <ReferralConditions
              selectedConditions={selectedConditions}
              setSelectedConditions={setSelectedConditions}
            />
            <Separator className="mb-1" />

            <ReferralProcedures
              selectedProcedures={selectedProcedures}
              setSelectedProcedures={setSelectedProcedures}
            />
            <Separator className="mb-1" />

            <ProviderSection
              provider={referral?.referringProvider}
              title="Referring Provider"
            />
            <Separator className="mb-1" />
            <ProviderSection
              provider={referral?.targetProvider}
              title="Target Provider"
            />
            <h3 className="text-xs mt-2 mb-1 font-semibold">
              Target Provider Full Name
            </h3>
            <ReferralUpdateField<EHR.UpdatableProvider | undefined>
              value={referral?.targetProvider}
              canUpdateParam={{
                targetProvider: true,
              }}
              valueToUpdatePayload={(value) => ({
                targetProvider: value,
              })}
              render={({ field: { value, onChange, disabled } }) => (
                <SelectField
                  valueName="npi"
                  selectedValue={value?.npi}
                  placeholder="Select target provider"
                  options={targetProvidersJson}
                  value={selectedTargetProvider}
                  onSelectedChange={(newProvider: EHR.UpdatableProvider) => {
                    setSelectedTargetProvider(newProvider);
                  }}
                  disabled={disabled}
                  onChange={(newProvider: EHR.UpdatableProvider) => {
                    onChange(newProvider);
                    setSelectedTargetProvider();
                  }}
                />
              )}
            />
          </form>
        </FormProvider>
      )}
    </div>
  );
};
