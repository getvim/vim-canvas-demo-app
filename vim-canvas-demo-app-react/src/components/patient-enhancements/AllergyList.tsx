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

interface AllergyListProps {
  allergies: EHR.Allergy[];
}

export const AllergyList = ({ allergies }: AllergyListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mb-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full h-[50px] flex items-center hover:bg-gray-100 bg-white justify-between p-0"
        >
          <div className="flex gap-2 items-center">
            <div className="flex flex-col items-start">
              <h4 className="text-sm font-semibold">Allergy list</h4>
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
            {allergies.map((allergy, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <EntityFieldContent>
                    <EntityFieldTitle title="Allergy" />
                    <EntityFieldReadonlyText
                      text={allergy.allergyDetails.name || "--"}
                    />
                  </EntityFieldContent>
                  <EntityFieldContent>
                    <EntityFieldTitle title="Criticality" />
                    <EntityFieldReadonlyText
                      text={allergy.allergyDetails.criticality || "--"}
                    />
                  </EntityFieldContent>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EntityFieldContent>
                    <EntityFieldTitle title="Reaction" />
                    <EntityFieldReadonlyText
                      text={allergy.allergyReactionDetails?.name || "--"}
                    />
                  </EntityFieldContent>
                  <EntityFieldContent>
                    <EntityFieldTitle title="Severity" />
                    <EntityFieldReadonlyText
                      text={allergy.allergyReactionDetails?.severity || "--"}
                    />
                  </EntityFieldContent>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EntityFieldContent>
                    <EntityFieldTitle title="Onset date" />
                    <EntityFieldReadonlyText
                      text={allergy.basicInformation.onsetDate || "--"}
                    />
                  </EntityFieldContent>
                  <EntityFieldContent>
                    <EntityFieldTitle title="Status" />
                    <EntityFieldReadonlyText
                      text={allergy.basicInformation?.status || "--"}
                    />
                  </EntityFieldContent>
                </div>
                {index < allergies.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
            <Separator className="mt-4" />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
