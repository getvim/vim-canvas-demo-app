import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { UpdateField } from "../update-fields/types";

interface Option {
  id: string;
  label: string;
}

interface SelectFieldProps<T> extends UpdateField<T> {
  options: Array<T & Option>;
  valueName: string;
  selectedValue?: string;
  placeholder: string;
  includeOptionsFields?: boolean;
  isDirty: boolean;
  formatOption?: (option: T) => string;
  onSelectedChange: (value: T | null) => void;
}

export function SelectField<T = unknown>({
  valueName,
  selectedValue,
  placeholder,
  onChange,
  isDirty,
  disabled,
  options,
  includeOptionsFields,
  formatOption,
  onSelectedChange,
}: SelectFieldProps<T>) {
  const [innerValue, setInnerValue] = useState<string | undefined>();
  const [key, setKey] = useState<number>(+new Date());

  useEffect(() => {
    setInnerValue(
      options.find(
        (o) =>
          o?.[valueName as keyof T]?.toString()?.toLowerCase() ===
          selectedValue?.toLowerCase()
      )?.id
    );
  }, [options, selectedValue, valueName]);

  return (
    <div className="flex w-full justify-between">
      <Select
        key={key}
        onValueChange={(value: string) => {
          setInnerValue(value);
          onSelectedChange?.(options.find((o) => o.id === value) as T);
        }}
        value={innerValue}
        disabled={disabled}
      >
        <SelectTrigger className="flex-grow rounded-r-none text-start">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => (
              <SelectItem key={index} value={option.id}>
                {formatOption ? formatOption(option) : option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <SmallActionButtons
        disabled={disabled}
        isCheckBtnDisabled={!isDirty}
        onCrossClick={(e) => {
          e.preventDefault();
          setKey(+new Date());

          setInnerValue(undefined);
          onSelectedChange(null);
        }}
        onCheckClick={(e) => {
          e.preventDefault();
          const { id, label, ...newValue } = options.find(
            (o) => o.id === innerValue
          )!;
          onChange(
            (includeOptionsFields
              ? {
                  id,
                  label,
                  ...newValue,
                }
              : newValue) as T
          );
          onSelectedChange(null);
        }}
      />
    </div>
  );
}
