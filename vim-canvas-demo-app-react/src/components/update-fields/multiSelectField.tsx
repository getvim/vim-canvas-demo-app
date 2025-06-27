import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { UpdateField } from "../update-fields/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
}

interface MultiSelectFieldProps<T> extends UpdateField<T> {
  options: Array<Option>;
  valueId?: string[];
  placeholder: string;
  includeOptionsFields?: boolean;
  formatOption?: (option: Option) => string;
  direction?: "up" | "down";
  onSelectedChange?: (option: Option[]) => void;
  selectedOptions?: Option[];
}

export function MultiSelectField<T = unknown>({
  valueId,
  placeholder,
  onChange,
  onSelectedChange,
  disabled,
  options,
  includeOptionsFields,
  formatOption,
  direction = "down",
  selectedOptions,
}: MultiSelectFieldProps<T>) {
  const [innerValue, setInnerValue] = useState<string[]>(
    Array.isArray(valueId) ? valueId : []
  );
  const [key, setKey] = useState<number>(+new Date());

  useEffect(() => {
    setInnerValue(Array.isArray(valueId) ? valueId : []);
  }, [valueId]);

  useEffect(() => {
    if (selectedOptions) {
      const newInnerValue = selectedOptions.map((option: Option) => option.id);
      setInnerValue(newInnerValue);
    }
  }, [selectedOptions]);

  const handleSelectedOptionsChanged = (newValues: string[]) => {
    const newOptions = newValues?.length
      ? options.filter((o) => newValues.includes(o.id))
      : [];
    setInnerValue(newValues);
    onSelectedChange?.(newOptions);
  };

  const handleRemoveOption = (optionId: string) => {
    const newValues = innerValue.filter((v: string) => v !== optionId);
    handleSelectedOptionsChanged(newValues);
  };

  const displayOptions = selectedOptions || [];

  const currentSelectedIds = selectedOptions?.map((option) => option.id) || [];

  return (
    <div className="flex w-full justify-between relative">
      <div className="flex-grow">
        <Select
          key={key}
          onValueChange={(value: string) => {
            const newValues = currentSelectedIds.includes(value)
              ? currentSelectedIds.filter((v: string) => v !== value)
              : [...currentSelectedIds, value];
            handleSelectedOptionsChanged(newValues);
          }}
          value={undefined}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              "w-full h-auto text-start min-h-[24px] rounded-md pb-8"
            )}
          >
            {displayOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1 items-center">
                {displayOptions.map((option: Option) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-1 bg-gray-200 text-accent-foreground pl-2 pr-1 py-0.5 rounded-[20px] text-sm"
                  >
                    <span>{option.id}</span>
                    <button
                      type="button"
                      tabIndex={-1}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveOption(option.id);
                      }}
                      className="hover:bg-accent-foreground/20 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground min-h-[24px] inline-block">
                {placeholder}
              </span>
            )}
          </SelectTrigger>
          <SelectContent side={direction === "up" ? "top" : "bottom"}>
            <SelectGroup>
              {options.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option.id}
                  className={
                    currentSelectedIds.includes(option.id) ? "bg-accent" : ""
                  }
                  showCheck={false}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentSelectedIds.includes(option.id)}
                      className="pointer-events-none w-[14px] h-[14px] border-gray-300 accent-primary"
                      readOnly
                    />
                    {formatOption ? formatOption(option) : option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <SmallActionButtons
        className="absolute right-0 bottom-0 w-auto"
        disabled={disabled}
        isCheckBtnDisabled={!innerValue?.length}
        crossClassName="rounded-tl-md border"
        checkClassName="rounded-tr-none"
        onCrossClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setKey(+new Date());
          handleSelectedOptionsChanged([]);
        }}
        onCheckClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          const selectedOptionsForSubmit = selectedOptions || [];

          const newValue = selectedOptionsForSubmit.map((option) => {
            const { id, label, ...rest } = option;
            return includeOptionsFields
              ? {
                  id,
                  label,
                  ...rest,
                }
              : rest;
          });

          onChange(newValue as T);

          setKey(+new Date());
          handleSelectedOptionsChanged([]);
        }}
      />
    </div>
  );
}
