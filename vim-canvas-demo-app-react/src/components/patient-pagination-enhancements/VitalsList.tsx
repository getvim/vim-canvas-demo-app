import { Separator } from "../ui/separator";
import { PaginationProgress } from "../ui/pagination-progress";
import { Button } from "../ui/button";
import { EntityFieldTitle, EntityFieldReadonlyText } from "../ui/entityContent";
import { EHR } from "vim-os-js-browser/types";

interface VitalsListProps {
  vitals: {
    items: EHR.Vitals[];
    pagination: EHR.PaginationResponse;
  };
  onNextPage: () => void;
}

export const VitalsList = ({ vitals, onNextPage }: VitalsListProps) => {
  return (
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

      {vitals.items.map((vital, index) => (
        <div key={index} className="mb-4">
          <div className="mb-4">
            <h5 className="text-sm font-bold mb-2">Basic information</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <EntityFieldTitle title="Name" />
                <EntityFieldReadonlyText
                  text={vital.basicInformation.name || "--"}
                />
              </div>
              <div>
                <EntityFieldTitle title="Unit" />
                <EntityFieldReadonlyText
                  text={vital.basicInformation.unit || "--"}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <EntityFieldTitle title="Loinc" />
                <EntityFieldReadonlyText
                  text={vital.basicInformation.loinc || "--"}
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="mb-4">
            <h5 className="text-sm font-bold mb-2">Measurements</h5>
            {vital.values.map((measurement, measurementIndex) => (
              <div key={measurementIndex} className="mb-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <EntityFieldTitle title="Value" />
                    <EntityFieldReadonlyText text={measurement.value || "--"} />
                  </div>
                  <div>
                    <EntityFieldTitle title="Measurement Date" />
                    <EntityFieldReadonlyText
                      text={measurement.measurementDate || "--"}
                    />
                  </div>
                </div>
                {measurementIndex < vital.values.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>

          {index < vitals.items.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
      <Separator className="mt-4" />

      {vitals.pagination.hasNextPage && (
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
