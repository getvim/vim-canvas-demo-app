import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SmallActionButtons } from '../ui/smallActionButtons';
import { UpdateField } from '../update-fields/types';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  label: string;
}

interface DiagnosisMultiSelectFieldProps<T> extends UpdateField<T> {
  options: Array<Option>;
  placeholder: string;
  includeOptionsFields?: boolean;
  formatOption?: (option: Option) => string;
  direction?: 'up' | 'down';
  onSelectedChange: (option: Option[]) => void;
  selectedOptions?: Option[];
  disabledOptionIds?: Set<string>;
}

export function DiagnosisMultiSelectField<T = unknown>({
  placeholder,
  onChange,
  onSelectedChange,
  disabled,
  options,
  includeOptionsFields,
  formatOption,
  direction = 'down',
  selectedOptions = [],
  disabledOptionIds = new Set(),
}: DiagnosisMultiSelectFieldProps<T>) {
  const selectedIds = new Set(selectedOptions.map((opt) => opt.id));

  const handleToggleOption = (optionId: string) => {
    // Prevent selection of disabled options
    if (disabledOptionIds.has(optionId)) {
      return;
    }

    const isSelected = selectedIds.has(optionId);
    const newSelectedOptions = isSelected
      ? selectedOptions.filter((opt) => opt.id !== optionId)
      : [...selectedOptions, options.find((opt) => opt.id === optionId)!];

    onSelectedChange(newSelectedOptions);
  };

  const handleRemoveOption = (optionId: string) => {
    onSelectedChange(selectedOptions.filter((opt) => opt.id !== optionId));
  };

  const handleClearAll = () => {
    onSelectedChange([]);
  };

  const handleSubmit = () => {
    const valueToSubmit = selectedOptions.map((option) => {
      const { id, label, ...rest } = option;
      return includeOptionsFields ? { id, label, ...rest } : rest;
    });
    onChange(valueToSubmit as T);
    onSelectedChange([]);
  };

  return (
    <div className="flex w-full justify-between relative">
      <div className="flex-grow">
        <Select onValueChange={handleToggleOption} value="" disabled={disabled}>
          <SelectTrigger className={cn('w-full h-auto text-start min-h-[24px] rounded-md pb-8')}>
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1 items-center">
                {selectedOptions.map((option) => (
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
              <span className="text-muted-foreground min-h-[24px] inline-block">{placeholder}</span>
            )}
          </SelectTrigger>
          <SelectContent side={direction === 'up' ? 'top' : 'bottom'}>
            <SelectGroup>
              {options.map((option) => {
                const isDisabled = disabledOptionIds.has(option.id);
                const isSelected = selectedIds.has(option.id);

                return (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className={cn(isDisabled ? 'cursor-not-allowed' : '')}
                    showCheck={false}
                    disabled={isDisabled}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected || isDisabled}
                        disabled={isDisabled}
                        className={cn(
                          'pointer-events-none w-[14px] h-[14px] border-gray-300 accent-primary',
                        )}
                        readOnly
                      />
                      <span>
                        {formatOption ? formatOption(option) : option.label}
                        {isDisabled && <span className="italic font-bold"> (already added)</span>}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <SmallActionButtons
        className="absolute right-0 bottom-0 w-auto"
        disabled={disabled}
        isCheckBtnDisabled={!selectedOptions.length}
        crossClassName="rounded-tl-md border"
        checkClassName="rounded-tr-none"
        onCrossClick={(e) => {
          e.preventDefault();
          handleClearAll();
        }}
        onCheckClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      />
    </div>
  );
}
