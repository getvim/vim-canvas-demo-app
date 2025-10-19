import { Separator } from "../ui/separator";
import { PaginationProgress } from "../ui/pagination-progress";
import { Button } from "../ui/button";
import { EntityFieldTitle, EntityFieldReadonlyText } from "../ui/entityContent";
import { EHR } from "vim-os-js-browser/types";

interface LabResultsProps {
  labResults: {
    items: EHR.LabResult[];
    pagination: EHR.PaginationResponse;
  };
  onNextPage: () => void;
}

export const LabResults = ({ labResults, onNextPage }: LabResultsProps) => {
  return (
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

      {labResults.items.map((labResult, index) => (
        <div key={index} className="mb-4">
          <div className="mb-4">
            <h5 className="text-sm font-bold mb-2">Basic information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <EntityFieldTitle title="Name" />
                <EntityFieldReadonlyText
                  text={labResult.basicInformation.name || "--"}
                />
              </div>
              <div>
                <EntityFieldTitle title="Procedure description" />
                <EntityFieldReadonlyText
                  text={labResult.basicInformation.cpt?.name || "--"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <EntityFieldTitle title="Procedure code" />
                <EntityFieldReadonlyText
                  text={labResult.basicInformation.cpt?.code || "--"}
                />
              </div>
              <div>
                <EntityFieldTitle title="System" />
                <EntityFieldReadonlyText
                  text={labResult.basicInformation.system || "--"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <EntityFieldTitle title="Results status" />
                <EntityFieldReadonlyText
                  text={labResult.basicInformation.resultStatus || "--"}
                />
              </div>
              <div>
                <EntityFieldTitle title="Result Date" />
                <EntityFieldReadonlyText
                  text={labResult.basicInformation.resultDate || "--"}
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="mb-4">
            <h5 className="text-sm font-bold mb-2">Results</h5>
            {labResult.results.map((result, resultIndex) => (
              <div key={resultIndex} className="mb-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <EntityFieldTitle title="Name" />
                    <EntityFieldReadonlyText text={result.name || "--"} />
                  </div>
                  <div>
                    <EntityFieldTitle title="Date" />
                    <EntityFieldReadonlyText text={result.date || "--"} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <EntityFieldTitle title="Value" />
                    <EntityFieldReadonlyText text={result.value || "--"} />
                  </div>
                  <div>
                    <EntityFieldTitle title="Unit" />
                    <EntityFieldReadonlyText text={result.unit || "--"} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <EntityFieldTitle title="Loinc" />
                    <EntityFieldReadonlyText text={result.loinc || "--"} />
                  </div>
                  <div>
                    <EntityFieldTitle title="Range" />
                    <EntityFieldReadonlyText text={result.range || "--"} />
                  </div>
                </div>
                {resultIndex < labResult.results.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>

          {index < labResults.items.length - 1 && (
            <Separator className="my-4" />
          )}
        </div>
      ))}

      {labResults.pagination.hasNextPage && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onNextPage}
            className="bg-white border-2 border-black text-gray-800 hover:bg-gray-50 px-6 py-2 w-full"
          >
            Get next page
          </Button>
        </div>
      )}
    </div>
  );
};
