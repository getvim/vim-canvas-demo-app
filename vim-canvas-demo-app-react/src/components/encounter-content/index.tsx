import { JSONView } from "@/components/ui/jsonView";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAppConfig } from "@/hooks/useAppConfig";
import { useVimOSEncounter } from "@/hooks/useEncounter";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { CheckIcon } from "@radix-ui/react-icons";
import { FormProvider } from "react-hook-form";
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

  const areNotesDirty = Object.keys(methods.formState.dirtyFields).length > 0;

  const onNotesSubmit = async (data: FormInputs) => {
    vimOs.ehr.resourceUpdater
      .updateEncounter({
        subjective: {
          generalNotes: data.subjectiveGeneralNotes ?? undefined,
          chiefComplaintNotes: data.subjectiveChiefComplaint ?? undefined,
          historyOfPresentIllnessNotes:
            data.subjectiveHistoryOfPresentIllness ?? undefined,
          reviewOfSystemsNotes: data.subjectiveReviewOfSystems ?? undefined,
        },
        objective: {
          generalNotes: data.objectiveGeneralNotes ?? undefined,
          physicalExamNotes: data.objectivePhysicalExamNotes ?? undefined,
        },
        assessment: {
          generalNotes: data.assessmentGeneralNotes ?? undefined,
        },
        plan: {
          generalNotes: data.planGeneralNotes ?? undefined,
        },
        patientInstructions: {
          generalNotes: data.patientInstructionsGeneralNotes ?? undefined,
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
      subjectiveGeneralNotes: null,
      subjectiveChiefComplaint: null,
      subjectiveHistoryOfPresentIllness: null,
      subjectiveReviewOfSystems: null,
      objectiveGeneralNotes: null,
      objectivePhysicalExamNotes: null,
      assessmentGeneralNotes: null,
      planGeneralNotes: null,
      patientInstructionsGeneralNotes: null,
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
                  disabled={!areNotesDirty}
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
