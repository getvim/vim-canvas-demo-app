import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface SmallActionButtonsProps {
  onCrossClick: () => void;
  onCheckClick: () => void;
  className?: string;
  crossClassName?: string;
  checkClassName?: string;
}

export const SmallActionButtons = ({
  onCrossClick,
  onCheckClick,
  className,
  crossClassName,
  checkClassName,
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
      >
        <Cross2Icon />
      </Button>
      <Button
        size={"sm"}
        className={cn("rounded-l-none h-7 w-7 p-0", checkClassName)}
        onClick={onCheckClick}
      >
        <CheckIcon />
      </Button>
    </div>
  );
};
