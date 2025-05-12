import { useEffect, useRef, useState } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { CopyIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { SmallActionButtons } from "@/components/ui/smallActionButtons";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { useToast } from "@/hooks/use-toast";
import { TextareaWithAdornment } from "@/components/ui/textareaWithAdornment";

export function TextareaField<T extends FieldValues = FieldValues>({
  clearAfterChange,
  onTextareaSubmit,
  placeholder,
  prefixAdornment,
  ...props
}: UseControllerProps<T> & {
  placeholder?: string;
  clearAfterChange?: boolean;
  onTextareaSubmit?: (value: string) => void;
  prefixAdornment?: string;
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
          prefixAdornment={prefixAdornment}
          key={key}
          placeholder={placeholder}
          {...field}
          disabled={!editMode}
          ref={textAreaRef}
        />
        {!editMode && (
          <div
            onClick={turnOnEditMode}
            className="absolute bottom-0 left-0 w-full h-[50px] cursor-text"
          ></div>
        )}
      </div>
      {!editMode ? (
        <Button
          size={"sm"}
          className="absolute right-0 bottom-0 h-7 w-7 p-0 rounded-tr-none rounded-bl-none"
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
