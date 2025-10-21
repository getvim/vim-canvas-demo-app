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

export const VitalsList = () => {
  const { patient } = useVimOSPatient();
  const [vitals, setVitals] = useState<{
    items: EHR.Vitals[];
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
        const result = await patient.getVitals({
          page,
          fromDate,
          untilDate,
        });

        if (append) {
          setVitals((prev) => {
            if (!prev || !result) return prev;
            return {
              items: [...prev.items, ...(result.items || [])],
              pagination: result.pagination || prev.pagination,
            };
          });
        } else {
          setVitals(result || null);
        }
      } catch (err) {
        const errorMessage =
          (err as { data?: { message?: string } }).data?.message ===
          "NOT_SUPPORTED_IN_EHR_SYSTEM"
            ? "Vitals is not supported in this EHR system yet."
            : `Failed to fetch ${
                page === 1 ? "" : "next page of "
              }vitals. Please try again.`;
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
    if (!vitals || !searchParams) return;

    const nextPage = vitals.pagination.currentPage + 1;
    await fetchData(
      searchParams.fromDate,
      searchParams.untilDate,
      nextPage,
      true
    );
  }, [fetchData, vitals, searchParams]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Separator className="my-4" />
      <CollapsibleHeader
        title="Get patient vitals"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        disabled={!vitals && !error}
      />
      <PaginationInput
        actionName="vitals"
        onActionClick={handleActionClick}
        isLoading={isLoading}
      />
      <CollapsibleContent className="animateCollapsibleContent">
        {(vitals || error) && (
          <div className="mt-2">
            <Separator className="my-4" />
            <h4 className="text-sm font-semibold mb-2">Vitals</h4>
            <Separator className="my-4" />
            {error ? (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            ) : (
              vitals && (
                <div className="w-full">
                  {vitals.pagination.totalItems > 0 && (
                    <PaginationProgress
                      currentPage={vitals.pagination.currentPage}
                      totalPageNumber={vitals.pagination.totalPages}
                      totalItems={vitals.pagination.totalItems}
                      numberOfFetchedItems={vitals.items.length}
                      enhancement="vital"
                    />
                  )}

                  {vitals.items.map((vital, index) => {
                    const { basicInformation } = vital;
                    const { name, unit, loinc } = basicInformation;
                    const { values } = vital;
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
                              <EntityFieldTitle title="Unit" />
                              <EntityFieldReadonlyText text={unit || "--"} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <EntityFieldTitle title="Loinc" />
                              <EntityFieldReadonlyText text={loinc || "--"} />
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="mb-4">
                          <h5 className="text-sm font-bold mb-2">
                            Measurements
                          </h5>
                          {values.map((measurement, measurementIndex) => {
                            const isNotLastMeasurement =
                              measurementIndex < values.length - 1;

                            return (
                              <div key={measurement.value} className="mb-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <EntityFieldTitle title="Value" />
                                    <EntityFieldReadonlyText
                                      text={measurement.value || "--"}
                                    />
                                  </div>
                                  <div>
                                    <EntityFieldTitle title="Measurement Date" />
                                    <EntityFieldReadonlyText
                                      text={measurement.measurementDate || "--"}
                                    />
                                  </div>
                                </div>
                                {isNotLastMeasurement && (
                                  <Separator className="my-2" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {index < vitals.items.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    );
                  })}
                  <Separator className="mt-4" />

                  {vitals.pagination.hasNextPage && (
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
