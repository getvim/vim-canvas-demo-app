import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  EntityFieldContent,
  EntityFieldTitle,
  EntityFieldReadonlyText,
} from "../ui/entityContent";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { EHR } from "vim-os-js-browser/types";

interface ProblemListProps {
  problems: EHR.PatientDiagnosis[];
}

export const ProblemList = ({ problems }: ProblemListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mb-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-[50px] flex items-center hover:bg-gray-100 bg-white justify-between p-2"
        >
          <div className="flex gap-2 items-center">
            <div className="flex flex-col items-start">
              <h4 className="text-sm font-semibold">Problem list</h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CaretDownIcon className="h-4 w-4" />
          </div>
        </Button>
      </CollapsibleTrigger>
      <div className="w-full flex items-center bg-white justify-between">
        <Separator className="mb-1" />
      </div>
      <CollapsibleContent className="animateCollapsibleContent">
        <div className="w-full flex items-center bg-white justify-between rounded-b-lg pt-1">
          <div className="w-full">
            {problems.map((problem, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <EntityFieldContent>
                    <EntityFieldTitle title="ICD Code" />
                    <EntityFieldReadonlyText text={problem.code || "--"} />
                  </EntityFieldContent>
                  <EntityFieldContent>
                    <EntityFieldTitle title="System" />
                    <EntityFieldReadonlyText text={problem.system || "--"} />
                  </EntityFieldContent>
                </div>
                <EntityFieldContent>
                  <EntityFieldTitle title="Description" />
                  <EntityFieldReadonlyText text={problem.description || "--"} />
                </EntityFieldContent>
                <div className="grid grid-cols-2 gap-4">
                  <EntityFieldContent>
                    <EntityFieldTitle title="Status" />
                    <EntityFieldReadonlyText text={problem.status || "--"} />
                  </EntityFieldContent>
                  <EntityFieldContent>
                    <EntityFieldTitle title="Onset Date" />
                    <EntityFieldReadonlyText text={problem.onsetDate || "--"} />
                  </EntityFieldContent>
                </div>
                {problem.note && (
                  <EntityFieldContent>
                    <EntityFieldTitle title="Notes" />
                    <EntityFieldReadonlyText text={problem.note || "--"} />
                  </EntityFieldContent>
                )}
                {index < problems.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
            <Separator className="mt-4" />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
