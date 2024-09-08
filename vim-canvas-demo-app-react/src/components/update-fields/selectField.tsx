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
  valueId?: string;
  placeholder: string;
  includeOptionsFields?: boolean;
  formatOption?: (option: T) => string;
}

export function SelectField<T = unknown>({
  valueId,
  placeholder,
  onChange,
  disabled,
  options,
  includeOptionsFields,
  formatOption,
}: SelectFieldProps<T>) {
  const [innerValue, setInnerValue] = useState<string | undefined>(
    options.find((o) => o.id === valueId)?.id
  );
  const [key, setKey] = useState<number>(+new Date());

  useEffect(() => {
    setInnerValue(options.find((o) => o.id === valueId)?.id);
  }, [options, valueId]);

  return (
    <div className="flex w-full justify-between">
      <Select
        key={key}
        onValueChange={setInnerValue}
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
        onCrossClick={() => {
          setInnerValue(undefined);
          setKey(+new Date());
        }}
        onCheckClick={() => {
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
        }}
      />
    </div>
  );
}
