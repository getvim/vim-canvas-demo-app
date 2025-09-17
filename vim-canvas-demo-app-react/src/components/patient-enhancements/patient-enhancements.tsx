import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { useVimOSPatient } from "@/hooks/usePatient";
import { ProblemList } from "./ProblemList";
import { MedicationList } from "./MedicationList";
import { AllergyList } from "./AllergyList";
import { EHR } from "vim-os-js-browser/types";

const enhancements = [
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
  const [enhancementResult, setEnhancementResult] = useState<{
    [key: string]:
      | EHR.PatientMedication[]
      | EHR.PatientDiagnosis[]
      | EHR.Allergy[];
  }>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const onEnhancementClick = useCallback(
    async (enhancement: (typeof enhancements)[number]) => {
      if (!patient) return;

      // Set loading state
      setLoadingStates((prev) => ({
        ...prev,
        [enhancement.name]: true,
      }));

      try {
        const functionName = enhancement.function as keyof typeof patient;
        const result = await (
          patient[functionName] as () => Promise<
            EHR.PatientMedication[] | EHR.PatientDiagnosis[] | EHR.Allergy[]
          >
        )();
        setEnhancementResult({
          ...enhancementResult,
          [enhancement.name]: result,
        });
      } finally {
        // Clear loading state
        setLoadingStates((prev) => ({
          ...prev,
          [enhancement.name]: false,
        }));
      }
    },
    [patient, enhancementResult]
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
          {enhancementResult[enhancement.name] && (
            <div className="mt-2">
              {enhancement.name === "problem list" && (
                <ProblemList
                  problems={
                    enhancementResult[
                      enhancement.name
                    ] as EHR.PatientDiagnosis[]
                  }
                />
              )}
              {enhancement.name === "medication list" && (
                <MedicationList
                  medications={
                    enhancementResult[
                      enhancement.name
                    ] as EHR.PatientMedication[]
                  }
                />
              )}
              {enhancement.name === "allergy list" && (
                <AllergyList
                  allergies={
                    enhancementResult[enhancement.name] as EHR.Allergy[]
                  }
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
