import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { MouseEventHandler, ReactElement } from "react";

interface SmallActionButtonsProps {
  onCrossClick: MouseEventHandler;
  onCheckClick: MouseEventHandler;
  className?: string;
  crossClassName?: string;
  checkClassName?: string;
  tooltipContent?: string;
  disabled?: boolean;
  checkIcon?: ReactElement;
}

export const SmallActionButtons = ({
  onCrossClick,
  onCheckClick,
  className,
  crossClassName,
  checkClassName,
  tooltipContent,
  checkIcon,
  disabled,
}: SmallActionButtonsProps) => {
  return (
    <div className={cn("w-[73px]", className)}>
      <Button
        size={"sm"}
        className={cn(
          "rounded-none border h-7 w-7 p-0 bg-white border-slate-400 border-l-0",
          crossClassName
        )}
        variant={"ghost"}
        onClick={onCrossClick}
        disabled={disabled}
      >
        <Cross2Icon />
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              className={cn("rounded-l-none h-7 w-7 p-0", checkClassName)}
              onClick={onCheckClick}
              disabled={disabled}
            >
              {checkIcon ?? <CheckIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-primary text-primary-foreground">
            <p>{tooltipContent ?? "Push to EHR"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
