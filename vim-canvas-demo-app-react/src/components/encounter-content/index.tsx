/* eslint-disable react-hooks/exhaustive-deps */
import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSEncounter } from "@/hooks/useEncounter";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { CheckIcon } from "@radix-ui/react-icons";
import { FormProvider } from "react-hook-form";
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
import { FormInputs, useNotesForm } from "./form";
import { EncounterObjective } from "./Objective";
import { EncounterPI } from "./PatientInstructions";
import { EncounterPlan } from "./Plan";
import { EncounterSubjective } from "./Subjective";

export const EncounterContent = () => {
  const { toast } = useToast();
  const { jsonMode } = useAppConfig();
  const vimOs = useVimOsContext();
  const { encounter } = useVimOSEncounter();

  const methods = useNotesForm();

  /**
   * Because input fields are never disabled (because when they can't be updated we show copy to clipboard UX),
   * We can't use react-hook-form to determine which inputs are for copy to clipboard and which are for updating.
   *
   * So we have to manually check if the input fields are dirty and if they can be updated.
   */
  const canUpdateObj: EHR.CanUpdateEncounterParams = {
    assessment: {},
    objective: {},
    patientInstructions: {},
    plan: {},
    subjective: {},
  };

  for (const key in methods.formState.dirtyFields) {
    const fieldName = key as keyof FormInputs;
    switch (fieldName) {
      case "subjectiveGeneralNotes":
        canUpdateObj.subjective!.generalNotes = true;
        break;
      case "subjectiveChiefComplaint":
        canUpdateObj.subjective!.chiefComplaintNotes = true;
        break;
      case "subjectiveHistoryOfPresentIllness":
        canUpdateObj.subjective!.historyOfPresentIllnessNotes = true;
        break;
      case "subjectiveReviewOfSystems":
        canUpdateObj.subjective!.reviewOfSystemsNotes = true;
        break;
      case "objectiveGeneralNotes":
        canUpdateObj.objective!.generalNotes = true;
        break;
      case "objectivePhysicalExamNotes":
        canUpdateObj.objective!.physicalExamNotes = true;
        break;
      case "assessmentGeneralNotes":
        canUpdateObj.assessment!.generalNotes = true;
        break;
      case "planGeneralNotes":
        canUpdateObj.plan!.generalNotes = true;
        break;
      case "patientInstructionsGeneralNotes":
        canUpdateObj.patientInstructions!.generalNotes = true;
        break;
    }
  }

  const canUpdateResult =
    vimOs.ehr.resourceUpdater.canUpdateEncounter(canUpdateObj);
  const areNotesDirty = Object.keys(methods.formState.dirtyFields).length > 0;

  const canUpdateNotes = {
    ...canUpdateResult,
    canUpdate: areNotesDirty && canUpdateResult.canUpdate,
  };

  const onNotesSubmit = async (data: FormInputs) => {
    vimOs.ehr.resourceUpdater
      .updateEncounter({
        subjective: {
          generalNotes: canUpdateNotes?.details.subjective?.generalNotes
            ? data.subjectiveGeneralNotes ?? undefined
            : undefined,
          chiefComplaintNotes: canUpdateNotes?.details.subjective
            ?.chiefComplaintNotes
            ? data.subjectiveChiefComplaint ?? undefined
            : undefined,
          historyOfPresentIllnessNotes: canUpdateNotes?.details.subjective
            ?.historyOfPresentIllnessNotes
            ? data.subjectiveHistoryOfPresentIllness ?? undefined
            : undefined,
          reviewOfSystemsNotes: canUpdateNotes?.details.subjective
            ?.reviewOfSystemsNotes
            ? data.subjectiveReviewOfSystems ?? undefined
            : undefined,
        },
        objective: {
          generalNotes: canUpdateNotes?.details.objective?.generalNotes
            ? data.objectiveGeneralNotes ?? undefined
            : undefined,
          physicalExamNotes: canUpdateNotes?.details.objective
            ?.physicalExamNotes
            ? data.objectivePhysicalExamNotes ?? undefined
            : undefined,
        },
        assessment: {
          generalNotes: canUpdateNotes?.details.assessment?.generalNotes
            ? data.assessmentGeneralNotes ?? undefined
            : undefined,
        },
        plan: {
          generalNotes: canUpdateNotes?.details.plan?.generalNotes
            ? data.planGeneralNotes ?? undefined
            : undefined,
        },
        patientInstructions: {
          generalNotes: canUpdateNotes?.details.patientInstructions
            ?.generalNotes
            ? data.patientInstructionsGeneralNotes ?? undefined
            : undefined,
        },
      })
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
    methods.reset({
      subjectiveGeneralNotes: canUpdateNotes?.details.subjective?.generalNotes
        ? null
        : undefined,
      subjectiveChiefComplaint: canUpdateNotes?.details.subjective
        ?.chiefComplaintNotes
        ? null
        : undefined,
      subjectiveHistoryOfPresentIllness: canUpdateNotes?.details.subjective
        ?.historyOfPresentIllnessNotes
        ? null
        : undefined,
      subjectiveReviewOfSystems: canUpdateNotes?.details.subjective
        ?.reviewOfSystemsNotes
        ? null
        : undefined,
      objectiveGeneralNotes: canUpdateNotes?.details.objective?.generalNotes
        ? null
        : undefined,
      objectivePhysicalExamNotes: canUpdateNotes?.details.objective
        ?.physicalExamNotes
        ? null
        : undefined,
      assessmentGeneralNotes: canUpdateNotes?.details.assessment?.generalNotes
        ? null
        : undefined,
      planGeneralNotes: canUpdateNotes?.details.plan?.generalNotes
        ? null
        : undefined,
      patientInstructionsGeneralNotes: canUpdateNotes?.details
        .patientInstructions?.generalNotes
        ? null
        : undefined,
    });
  };

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
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onNotesSubmit)}>
              <div className="flex justify-between items-center">
                <EntitySectionTitle
                  className="text-md"
                  title="Clinical notes"
                />
                <Button
                  size="sm"
                  variant="default"
                  className="pl-2 pr-3 h-8"
                  disabled={!canUpdateNotes?.canUpdate}
                  onClick={() => {}}
                >
                  <CheckIcon className="mr-2" />
                  Push all notes
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
            </form>
          </FormProvider>
          <Separator className="mb-1" />
          <ProviderSection provider={encounter?.provider} title="Provider" />
        </>
      )}
    </div>
  );
};
