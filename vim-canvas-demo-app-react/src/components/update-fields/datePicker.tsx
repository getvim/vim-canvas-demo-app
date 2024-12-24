import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

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

const safeFormat = (date: Date) => {
  try {
    return format(date, "PPP");
  } catch {
    return "";
  }
};

export function DatePicker({
  value,
  onChange,
  disabled,
}: UpdateField<Date | undefined>) {
  const [innerValue, setInnerValue] = useState(value);
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "w-[240px] h-7 justify-start text-left font-normal",
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
          onSelect={(day) => {
            setIsOpen(false);
            onChange(day);
            setInnerValue(day);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
