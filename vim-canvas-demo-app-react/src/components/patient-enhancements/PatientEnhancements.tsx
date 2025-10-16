import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useVimOSPatient } from "@/hooks/usePatient";
import { ProblemList } from "./ProblemList";
import { MedicationList } from "./MedicationList";
import { AllergyList } from "./AllergyList";
import { EHR } from "vim-os-js-browser/types";
import { capitalize } from "@/lib/utils";

type EnhancementName =
  | "problem list"
  | "medication list"
  | "allergy list"
  | "lab results";

type EnhancementFunction =
  | "getProblemList"
  | "getMedicationList"
  | "getAllergyList"
  | "getLabResults";

type Enhancement = {
  name: EnhancementName;
  function: EnhancementFunction;
};

const enhancements: Enhancement[] = [
  {
    name: "problem list",
    function: "getProblemList",
  },
  {
    name: "medication list",
    function: "getMedicationList",
  },
  {
    name: "allergy list",
    function: "getAllergyList",
  },
];

export const PatientEnhancements = () => {
  const { patient } = useVimOSPatient();
  const [enhancementResult, setEnhancementResult] = useState<
    Partial<{
      "problem list": EHR.PatientDiagnosis[];
      "medication list": EHR.PatientMedication[];
      "allergy list": EHR.Allergy[];
      "lab results": EHR.LabResult[];
    }>
  >({});
  const [loadingStates, setLoadingStates] = useState<
    Partial<Record<EnhancementName, boolean>>
  >({});
  const [errorStates, setErrorStates] = useState<
    Partial<Record<EnhancementName, string>>
  >({});

  const onEnhancementClick = useCallback(
    async (enhancement: Enhancement) => {
      if (!patient) return;

      // Clear any previous error and set loading state
      setErrorStates((prev) => ({
        ...prev,
        [enhancement.name]: undefined,
      }));
      setLoadingStates((prev) => ({
        ...prev,
        [enhancement.name]: true,
      }));

      try {
        if (enhancement.function === "getProblemList") {
          const result = await patient.getProblemList();
          setEnhancementResult((prev) => ({
            ...prev,
            "problem list": result,
          }));
        } else if (enhancement.function === "getMedicationList") {
          const result = await patient.getMedicationList();
          setEnhancementResult((prev) => ({
            ...prev,
            "medication list": result,
          }));
        } else if (enhancement.function === "getAllergyList") {
          const result = await patient.getAllergyList();
          setEnhancementResult((prev) => ({
            ...prev,
            "allergy list": result,
          }));
        } else {
          throw new Error(
            `Unknown enhancement function: ${enhancement.function}`
          );
        }
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } }).data?.message ===
          "NOT_SUPPORTED_IN_EHR_SYSTEM" //not supported
            ? `${capitalize(
                enhancement.name
              )} is not supported in this EHR system yet.`
            : `Failed to fetch ${enhancement.name}. Please try again.`;
        setErrorStates((prev) => ({
          ...prev,
          [enhancement.name]: errorMessage,
        }));
      } finally {
        // Clear loading state
        setLoadingStates((prev) => ({
          ...prev,
          [enhancement.name]: false,
        }));
      }
    },
    [patient]
  );

  return (
    <div>
      {enhancements.map((enhancement) => (
        <div key={enhancement.name} className="mb-2">
          <Button
            onClick={() => onEnhancementClick(enhancement)}
            variant="outline"
            disabled={loadingStates[enhancement.name]}
            className="w-full justify-center bg-white border-2 border-black text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingStates[enhancement.name] ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                Loading...
              </div>
            ) : (
              `Get patient ${enhancement.name}`
            )}
          </Button>
          {(enhancementResult[enhancement.name] ||
            errorStates[enhancement.name]) && (
            <div className="mt-2">
              {errorStates[enhancement.name] ? (
                <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <p className="text-red-700 text-sm font-medium">
                      {errorStates[enhancement.name]}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {enhancement.name === "problem list" &&
                    enhancementResult["problem list"] && (
                      <ProblemList
                        problems={enhancementResult["problem list"]}
                      />
                    )}
                  {enhancement.name === "medication list" &&
                    enhancementResult["medication list"] && (
                      <MedicationList
                        medications={enhancementResult["medication list"]}
                      />
                    )}
                  {enhancement.name === "allergy list" &&
                    enhancementResult["allergy list"] && (
                      <AllergyList
                        allergies={enhancementResult["allergy list"]}
                      />
                    )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
