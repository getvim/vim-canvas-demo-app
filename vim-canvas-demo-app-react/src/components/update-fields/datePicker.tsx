import { CalendarIcon, CopyIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UpdateField } from "./types";
import { useEffect, useState } from "react";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { useToast } from "@/hooks/use-toast";

const safeFormat = (date: Date) => {
  try {
    return format(date, "MM/dd/yyyy");
  } catch {
    return "";
  }
};

interface DatePickerProps extends UpdateField<string | undefined> {
  onDateChange: (date: Date | undefined) => void;
  isDirty: boolean;
  hideActionButtons?: boolean;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  onDateChange,
  isDirty,
  hideActionButtons = false,
}: DatePickerProps) {
  const { toast } = useToast();
  const vimOs = useVimOsContext();
  const [innerValue, setInnerValue] = useState<Date | undefined>(
    value ? parseISO(value) : undefined
  );
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    setInnerValue(value ? parseISO(value) : undefined);
  }, [value]);

  return (
    <div className="flex w-full justify-between">
      <div className="flex-grow">
        <Popover
          open={open}
          onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
        >
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant={"outline"}
              className={cn(
                "w-full h-7 justify-start text-left font-normal",
                !hideActionButtons && "rounded-r-none",
                !innerValue && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {innerValue ? safeFormat(innerValue) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={innerValue}
              onSelect={(day: Date | undefined) => {
                setIsOpen(false);
                setInnerValue(day);
                onDateChange?.(day);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {!hideActionButtons && (
        <SmallActionButtons
          isCheckBtnDisabled={!isDirty}
          disabled={disabled}
          tooltipContent={disabled ? "Copy to clipboard" : undefined}
          checkIcon={disabled ? <CopyIcon /> : undefined}
          onCrossClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsOpen(false);
            setInnerValue(undefined);
            onDateChange(undefined);
          }}
          onCheckClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsOpen(false);
            if (disabled) {
              const dateText = innerValue ? safeFormat(innerValue) : "";
              vimOs.utils.copyToClipboard(dateText);
              toast({
                variant: "default",
                title: "Copied to clipboard",
              });
            } else {
              onChange(
                innerValue ? format(innerValue, "yyyy-MM-dd") : undefined
              );
              onDateChange(undefined);
            }
          }}
        />
      )}
    </div>
  );
}
