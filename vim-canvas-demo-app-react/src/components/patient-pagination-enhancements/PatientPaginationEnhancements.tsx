import { useState, useCallback } from "react";
import { PaginationInput } from "./PaginationInput";
import { CollapsibleHeader } from "./CollapsibleHeader";
import { LabResults } from "./LabResults";
import { VitalsList } from "./VitalsList";
import { useVimOSPatient } from "@/hooks/usePatient";
import { EHR } from "vim-os-js-browser/types";
import { capitalize } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";

type PaginationEnhancementName = "lab results" | "vitals";

type PaginationEnhancement = {
  name: PaginationEnhancementName;
  displayName: string;
};

const paginationEnhancements: PaginationEnhancement[] = [
  {
    name: "lab results",
    displayName: "Get patient lab results",
  },
  {
    name: "vitals",
    displayName: "Get patient vitals",
  },
];

export const PatientPaginationEnhancements = () => {
  const { patient } = useVimOSPatient();
  const [enhancementResult, setEnhancementResult] = useState<
    Partial<{
      "lab results": {
        items: EHR.LabResult[];
        pagination: EHR.PaginationResponse;
      };
      vitals: {
        items: EHR.Vitals[];
        pagination: EHR.PaginationResponse;
      };
    }>
  >({});
  const [loadingStates, setLoadingStates] = useState<
    Partial<Record<PaginationEnhancementName, boolean>>
  >({});
  const [errorStates, setErrorStates] = useState<
    Partial<Record<PaginationEnhancementName, string>>
  >({});
  const [isOpenStates, setIsOpenStates] = useState<
    Partial<Record<PaginationEnhancementName, boolean>>
  >({});
  const [searchParams, setSearchParams] = useState<
    Partial<
      Record<PaginationEnhancementName, { fromDate: string; untilDate: string }>
    >
  >({});

  const handleToggle = (enhancementName: PaginationEnhancementName) => {
    setIsOpenStates((prev) => ({
      ...prev,
      [enhancementName]: !prev[enhancementName],
    }));
  };

  const fetchData = useCallback(
    async (
      enhancementName: PaginationEnhancementName,
      fromDate: string,
      untilDate: string,
      page: number = 1,
      append: boolean = false
    ) => {
      if (!patient) return;

      // Clear any previous error and set loading state
      setErrorStates((prev) => ({
        ...prev,
        [enhancementName]: undefined,
      }));
      setLoadingStates((prev) => ({
        ...prev,
        [enhancementName]: true,
      }));

      // Store search parameters for pagination (only on first page)
      if (page === 1) {
        setSearchParams((prev) => ({
          ...prev,
          [enhancementName]: { fromDate, untilDate },
        }));

        // Open the collapsible when action is clicked
        setIsOpenStates((prev) => ({
          ...prev,
          [enhancementName]: true,
        }));
      }

      try {
        if (enhancementName === "lab results") {
          const result = await patient.getLabResults({
            page,
            fromDate,
            untilDate,
          });

          if (append) {
            setEnhancementResult((prev) => {
              const current = prev["lab results"];
              if (!current) return prev;

              return {
                ...prev,
                "lab results": {
                  items: [...current.items, ...(result?.items || [])],
                  pagination: result?.pagination || current.pagination,
                },
              };
            });
          } else {
            setEnhancementResult((prev) => ({
              ...prev,
              "lab results": result,
            }));
          }
        } else if (enhancementName === "vitals") {
          const result = await patient.getVitals({
            page,
            fromDate,
            untilDate,
          });

          if (append) {
            setEnhancementResult((prev) => {
              const current = prev.vitals;
              if (!current) return prev;

              return {
                ...prev,
                vitals: {
                  items: [...current.items, ...(result?.items || [])],
                  pagination: result?.pagination || current.pagination,
                },
              };
            });
          } else {
            setEnhancementResult((prev) => ({
              ...prev,
              vitals: result,
            }));
          }
        } else {
          throw new Error(`Unknown enhancement function: ${enhancementName}`);
        }
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } }).data?.message ===
          "NOT_SUPPORTED_IN_EHR_SYSTEM"
            ? `${capitalize(
                enhancementName
              )} is not supported in this EHR system yet.`
            : `Failed to fetch ${
                page === 1 ? "" : "next page of "
              }${enhancementName}. Please try again.`;
        setErrorStates((prev) => ({
          ...prev,
          [enhancementName]: errorMessage,
        }));
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          [enhancementName]: false,
        }));
      }
    },
    [patient]
  );

  const handleActionClick = useCallback(
    (enhancementName: PaginationEnhancementName) =>
      async (fromDate: string, untilDate: string) => {
        await fetchData(enhancementName, fromDate, untilDate, 1, false);
      },
    [fetchData]
  );

  const handleNextPage = useCallback(
    async (enhancementName: PaginationEnhancementName) => {
      const currentResult = enhancementResult[enhancementName];
      if (!currentResult) return;

      const nextPage = currentResult.pagination.currentPage + 1;
      const params = searchParams[enhancementName];
      if (!params) return;

      await fetchData(
        enhancementName,
        params.fromDate,
        params.untilDate,
        nextPage,
        true
      );
    },
    [fetchData, enhancementResult, searchParams]
  );

  return (
    <div>
      {paginationEnhancements.map((enhancement) => (
        <div key={enhancement.name} className="mb-4">
          <Collapsible
            open={isOpenStates[enhancement.name] || false}
            onOpenChange={() => handleToggle(enhancement.name)}
          >
            <Separator className="my-4" />
            <CollapsibleHeader
              title={enhancement.displayName}
              isOpen={isOpenStates[enhancement.name] || false}
              onToggle={() => handleToggle(enhancement.name)}
              disabled={
                !enhancementResult[enhancement.name] &&
                !errorStates[enhancement.name]
              }
            />
            <PaginationInput
              actionName={enhancement.name}
              onActionClick={handleActionClick(enhancement.name)}
              isLoading={loadingStates[enhancement.name] || false}
            />
            <CollapsibleContent className="animateCollapsibleContent">
              {(enhancementResult[enhancement.name] ||
                errorStates[enhancement.name]) && (
                <div className="mt-2">
                  <Separator className="my-4" />
                  <h4 className="text-sm font-semibold mb-2">
                    {enhancement.name === "lab results"
                      ? "Labs results"
                      : "Vitals"}
                  </h4>
                  <Separator className="my-4" />
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
                      {enhancement.name === "lab results" &&
                        enhancementResult["lab results"] && (
                          <LabResults
                            labResults={enhancementResult["lab results"]}
                            onNextPage={() => handleNextPage("lab results")}
                          />
                        )}
                      {enhancement.name === "vitals" &&
                        enhancementResult.vitals && (
                          <VitalsList
                            vitals={enhancementResult.vitals}
                            onNextPage={() => handleNextPage("vitals")}
                          />
                        )}
                    </>
                  )}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};
