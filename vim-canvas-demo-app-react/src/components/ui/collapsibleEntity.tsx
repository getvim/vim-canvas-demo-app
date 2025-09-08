import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CaretDownIcon } from "@radix-ui/react-icons";
import cssFilterConverter from "css-filter-converter";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import { Separator } from "./separator";

const hexToFilter = (hex: string) => {
  const base = hex.slice(0, 7);
  const opacity = hex.slice(7);
  const filter = cssFilterConverter.hexToFilter(base);
  if (filter.error || !filter.color) {
    return "";
  }
  if (opacity) {
    return filter.color?.concat(` opacity(${opacity}%)`);
  }
  return filter.color;
};

interface CollapsibleEntityProps {
  entityTitle:
    | "User"
    | "Patient"
    | "Encounter"
    | "Referral"
    | "Claim"
    | "Order"
    | "Order created";
  titleSuffix?: string;
  entityIconUrl: string;
  themeColor?: string;
  badge?: "State" | "Event";
  subtitle?: string;
  rightAccessory?: ReactNode;
  variant?: "default" | "dashed";
}

const DEFAULT_ICON_COLOR = "#04B39F";

export function CollapsibleEntity({
  entityTitle,
  titleSuffix,
  entityIconUrl,
  children,
  themeColor,
  subtitle,
  rightAccessory,
  badge = "State",
  variant = "default",
}: React.PropsWithChildren<CollapsibleEntityProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mb-2">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-[calc(100%-16px)] h-[50px] flex items-center hover:bg-[rgb(242,255,253)] bg-white justify-between p-2 m-3 mb-0 mx-2",
            {
              "rounded-b-none": isOpen,
            },
            variant === "dashed" &&
              (isOpen
                ? "border border-slate-500 border-dashed border-b-0"
                : "border border-slate-500 border-dashed")
          )}
          style={{
            backgroundColor: isHovered
              ? themeColor
                ? `${themeColor}20`
                : "rgb(242, 255, 253)"
              : "white",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-2 items-center">
            <img
              src={entityIconUrl}
              className="w-[25px] h-[25px]"
              style={{ filter: hexToFilter(themeColor ?? DEFAULT_ICON_COLOR) }}
            />
            <div className="flex flex-col items-start">
              <div className="flex items-baseline gap-1">
                <h4 className="text-sm font-semibold">{entityTitle}</h4>
                {titleSuffix && (
                  <span className="text-xs text-slate-500 font-normal">
                    {titleSuffix}
                  </span>
                )}
              </div>
              {subtitle && (
                <span className="text-xs text-slate-500 font-normal">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {rightAccessory}
              <span className="text-[10px] px-1.5 rounded-full border border-slate-500 text-slate-500">
                {badge}
              </span>
            </div>
            <CaretDownIcon className="h-4 w-4" />
          </div>
        </Button>
      </CollapsibleTrigger>
      {isOpen && variant !== "dashed" && (
        <div className="w-[calc(100%-16px)] flex items-center bg-white justify-between pl-2 pr-4 mx-2">
          <Separator className="mb-1 mx-1" />
        </div>
      )}
      {children}
    </Collapsible>
  );
}

export const CollapsibleEntityContent = ({
  children,
  variant = "default",
}: PropsWithChildren & { variant?: "default" | "dashed" }) => {
  return (
    <CollapsibleContent className="animateCollapsibleContent">
      <div
        className={cn(
          "w-[calc(100%-16px)] flex items-center bg-white justify-between rounded-b-lg px-7 pt-1 pb-5 mx-2",
          {
            "border-x border-b border-slate-500 border-dashed":
              variant === "dashed",
          }
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
};
