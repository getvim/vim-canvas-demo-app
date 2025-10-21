import { useState, useCallback } from "react";
import { Separator } from "../ui/separator";
import { PaginationProgress } from "../ui/pagination-progress";
import { Button } from "../ui/button";
import { EntityFieldTitle, EntityFieldReadonlyText } from "../ui/entityContent";
import { EHR } from "vim-os-js-browser/types";
import { PaginationInput } from "./PaginationInput";
import { useVimOSPatient } from "@/hooks/usePatient";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { CollapsibleHeader } from "./CollapsibleHeader";

export const LabResults = () => {
  const { patient } = useVimOSPatient();
  const [labResults, setLabResults] = useState<{
    items: EHR.LabResult[];
    pagination: EHR.PaginationResponse;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    fromDate: string;
    untilDate: string;
  } | null>(null);

  const fetchData = useCallback(
    async (
      fromDate: string,
      untilDate: string,
      page: number = 1,
      append: boolean = false
    ) => {
      if (!patient) return;

      setError(undefined);
      setIsLoading(true);

      if (page === 1) {
        setSearchParams({ fromDate, untilDate });
        setIsOpen(true);
      }

      try {
        const result = await patient.getLabResults({
          page,
          fromDate,
          untilDate,
        });

        if (append) {
          setLabResults((prev) => {
            if (!prev || !result) return prev;
            return {
              items: [...prev.items, ...(result.items || [])],
              pagination: result.pagination || prev.pagination,
            };
          });
        } else {
          setLabResults(result || null);
        }
      } catch (err) {
        const errorMessage =
          (err as { data?: { message?: string } }).data?.message ===
          "NOT_SUPPORTED_IN_EHR_SYSTEM"
            ? "Lab results is not supported in this EHR system yet."
            : `Failed to fetch ${
                page === 1 ? "" : "next page of "
              }lab results. Please try again.`;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [patient]
  );

  const handleActionClick = useCallback(
    async (fromDate: string, untilDate: string) => {
      await fetchData(fromDate, untilDate, 1, false);
    },
    [fetchData]
  );

  const handleNextPage = useCallback(async () => {
    if (!labResults || !searchParams) return;

    const nextPage = labResults.pagination.currentPage + 1;
    await fetchData(
      searchParams.fromDate,
      searchParams.untilDate,
      nextPage,
      true
    );
  }, [fetchData, labResults, searchParams]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Separator className="my-4" />
      <CollapsibleHeader
        title="Get patient lab results"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        disabled={!labResults && !error}
      />
      <PaginationInput
        actionName="lab results"
        onActionClick={handleActionClick}
        isLoading={isLoading}
      />
      <CollapsibleContent className="animateCollapsibleContent">
        {(labResults || error) && (
          <div className="mt-2">
            <Separator className="my-4" />
            <h4 className="text-sm font-semibold mb-2">Labs results</h4>
            <Separator className="my-4" />
            {error ? (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            ) : (
              labResults && (
                <div className="w-full">
                  {labResults.pagination.totalItems > 0 && (
                    <PaginationProgress
                      currentPage={labResults.pagination.currentPage}
                      totalPageNumber={labResults.pagination.totalPages}
                      totalItems={labResults.pagination.totalItems}
                      numberOfFetchedItems={labResults.items.length}
                      enhancement="lab"
                    />
                  )}

                  {labResults.items.map((labResult, index) => {
                    const { basicInformation } = labResult;
                    const { name, cpt, system, resultStatus, resultDate } =
                      basicInformation;
                    const { results } = labResult;
                    return (
                      <div key={name} className="mb-4">
                        <div className="mb-4">
                          <h5 className="text-sm font-bold mb-2">
                            Basic information
                          </h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <EntityFieldTitle title="Name" />
                              <EntityFieldReadonlyText text={name || "--"} />
                            </div>
                            <div>
                              <EntityFieldTitle title="Procedure description" />
                              <EntityFieldReadonlyText
                                text={cpt?.name || "--"}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <EntityFieldTitle title="Procedure code" />
                              <EntityFieldReadonlyText
                                text={cpt?.code || "--"}
                              />
                            </div>
                            <div>
                              <EntityFieldTitle title="System" />
                              <EntityFieldReadonlyText text={system || "--"} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <EntityFieldTitle title="Results status" />
                              <EntityFieldReadonlyText
                                text={resultStatus || "--"}
                              />
                            </div>
                            <div>
                              <EntityFieldTitle title="Result Date" />
                              <EntityFieldReadonlyText
                                text={resultDate || "--"}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="mb-4">
                          <h5 className="text-sm font-bold mb-2">Results</h5>
                          {results.map((result, resultIndex) => {
                            const isNotLastResult =
                              resultIndex < results.length - 1;

                            return (
                              <div key={result.value} className="mb-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <EntityFieldTitle title="Name" />
                                    <EntityFieldReadonlyText
                                      text={result.name || "--"}
                                    />
                                  </div>
                                  <div>
                                    <EntityFieldTitle title="Date" />
                                    <EntityFieldReadonlyText
                                      text={result.date || "--"}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <EntityFieldTitle title="Value" />
                                    <EntityFieldReadonlyText
                                      text={result.value || "--"}
                                    />
                                  </div>
                                  <div>
                                    <EntityFieldTitle title="Unit" />
                                    <EntityFieldReadonlyText
                                      text={result.unit || "--"}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <EntityFieldTitle title="Loinc" />
                                    <EntityFieldReadonlyText
                                      text={result.loinc || "--"}
                                    />
                                  </div>
                                  <div>
                                    <EntityFieldTitle title="Range" />
                                    <EntityFieldReadonlyText
                                      text={result.range || "--"}
                                    />
                                  </div>
                                </div>
                                {isNotLastResult && (
                                  <Separator className="my-2" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {index < labResults.items.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    );
                  })}

                  {labResults.pagination.hasNextPage && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={handleNextPage}
                        className="bg-white border-2 border-black text-gray-800 hover:bg-gray-50 px-6 py-2 w-full"
                      >
                        Get next page
                      </Button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
