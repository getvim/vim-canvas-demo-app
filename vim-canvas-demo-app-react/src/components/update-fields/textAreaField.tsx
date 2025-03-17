import { CopyIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import {
  FieldValues,
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { TextareaWithAdornment } from "../ui/textareaWithAdornment";

export function TextareaField<T extends FieldValues = FieldValues>({
  clearAfterChange,
  onTextareaSubmit,
  placeholder,
  currentValue,
  ...props
}: UseControllerProps<T> & {
  placeholder?: string;
  clearAfterChange?: boolean;
  onTextareaSubmit?: (value: string) => void;
  currentValue?: string;
}) {
  const { toast } = useToast();
  const { field } = useController(props);
  const { resetField } = useFormContext();
  const [editMode, setEditMode] = useState(false);
  const vimOs = useVimOsContext();
  const [key, setKey] = useState<number>(+new Date());
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (field.value === null) {
      setEditMode(false);
      setKey(+new Date());
      resetField(field.name);
    }
  }, [field.name, field.value, resetField]);

  const turnOnEditMode = () => {
    setEditMode(true);
    setTimeout(() => {
      console.log("focus", textAreaRef.current);
      textAreaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="flex w-full relative justify-between">
      <div className="relative w-full">
        <TextareaWithAdornment
          prefixAdornment={currentValue}
          key={key}
          className="disabled:bg-secondary"
          placeholder={placeholder}
          {...field}
          disabled={!editMode}
          ref={textAreaRef}
        />
        {!editMode && (
          <div
            onClick={turnOnEditMode}
            className="absolute top-0 left-0 w-full h-full"
          ></div>
        )}
      </div>
      {!editMode ? (
        <Button
          size={"sm"}
          variant={"ghost"}
          className="absolute right-2 top-2 h-7 w-7 p-0"
          onClick={turnOnEditMode}
        >
          <Pencil1Icon />
        </Button>
      ) : (
        <SmallActionButtons
          className="absolute -right-[16px] bottom-0"
          crossClassName="rounded-l-md rounded-es-none border-l-1"
          checkClassName="rounded-se-none"
          tooltipContent={field.disabled ? "Copy to clipboard" : undefined}
          checkIcon={field.disabled ? <CopyIcon /> : undefined}
          onCrossClick={() => {
            setEditMode(false);
            setKey(+new Date());
            resetField(field.name);
          }}
          onCheckClick={() => {
            setEditMode(false);
            if (field.disabled) {
              vimOs.utils.copyToClipboard(field.value ?? "");
              toast({
                variant: "default",
                title: "Copied to clipboard",
              });
            } else {
              onTextareaSubmit?.(field.value);
            }
            if (clearAfterChange) {
              setKey(+new Date());
              resetField(field.name);
            }
          }}
        />
      )}
    </div>
  );
}
