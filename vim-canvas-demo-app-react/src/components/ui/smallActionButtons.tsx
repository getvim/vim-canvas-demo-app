import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./button";

interface SmallActionButtonsProps {
  onCrossClick: () => void;
  onCheckClick: () => void;
}

export const SmallActionButtons = ({
  onCrossClick,
  onCheckClick,
}: SmallActionButtonsProps) => {
  return (
    <div className="w-[73px]">
      <Button
        size={"sm"}
        className="rounded-none border h-7 w-7 p-0 border-slate-400 border-l-0"
        variant={"ghost"}
        onClick={onCrossClick}
      >
        <Cross2Icon />
      </Button>
      <Button
        size={"sm"}
        className="rounded-l-none h-7 w-7 p-0"
        onClick={onCheckClick}
      >
        <CheckIcon />
      </Button>
    </div>
  );
};
