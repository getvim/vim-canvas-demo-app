import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretDownIcon } from "@radix-ui/react-icons";
import React, { PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";

interface CollapsibleEntityProps {
  entityTitle: "User" | "Patient" | "Encounter" | "Referral" | "Order" | "ScribeAI Note Generator";
  entityIconUrl: string;
}

export function CollapsibleEntity({
  entityTitle,
  entityIconUrl,
  children,
}: React.PropsWithChildren<CollapsibleEntityProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mb-4">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-[calc(100%-16px)] h-fit flex items-center hover:bg-[rgb(242,255,253)] bg-white justify-between rounded-lg p-4 m-4 mb-0 mx-2",
            {
              "rounded-b-none": isOpen,
            }
          )}
        >
          <div className="flex gap-2">
            <img src={entityIconUrl} className="w-[20px] h-[20px]" />
            <h4 className="text-sm font-semibold">{entityTitle}</h4>
          </div>

          <CaretDownIcon className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      {isOpen && (
        <div className="w-[calc(100%-16px)] flex items-center bg-white justify-between pl-2 pr-4 mx-2">
          <Separator className="mb-1 mx-1" />
        </div>
      )}
      {children}
    </Collapsible>
  );
}

export const CollapsibleEntityContent = ({ children }: PropsWithChildren) => {
  return (
    <CollapsibleContent className="animateCollapsibleContent">
      <div className="w-[calc(100%-16px)] flex items-center bg-white justify-between rounded-b-lg px-7 pt-1 pb-5 mx-2">
        {children}
      </div>
    </CollapsibleContent>
  );
};
