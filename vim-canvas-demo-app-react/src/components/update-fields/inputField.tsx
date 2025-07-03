import { Input } from "@/components/ui/input";
import { CopyIcon, Pencil1Icon } from "@radix-ui/react-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { UpdateField } from "../update-fields/types";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { useToast } from "@/hooks/use-toast";
import { isValueNumber } from "../../utils/isNumberChar";

export const InputField = ({
  value,
  onChange,
  onInputChange,
  disabled,
  inputType = "text",
  min,
  isDirty,
}: UpdateField<string | undefined> & {
  isDirty: boolean;
  onInputChange: (value: string | null) => void;
}) => {
  const { toast } = useToast();
  const [innerValue, setInnerValue] = useState<string | undefined>(value);
  const [editMode, setEditMode] = useState(false);
  const vimOs = useVimOsContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const turnOnEditMode = () => {
    setEditMode(true);
    setTimeout(() => {
      console.log("focus", inputRef.current);
      inputRef.current?.focus();
    }, 0);
  };

  const numberInputValidator = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (inputType === "number" && !evt.metaKey) {
        if (!isValueNumber(evt.key)) {
          evt.preventDefault();
        }
      }
    },
    [inputType]
  );

  const numberInputPasteValidator = useCallback(
    (evt: React.ClipboardEvent<HTMLInputElement>) => {
      if (inputType === "number") {
        const clipboardData = evt.clipboardData?.getData("text");
        if (clipboardData && !isValueNumber(clipboardData)) {
          evt.preventDefault();
        }
      }
    },
    [inputType]
  );

  return (
    <div className="flex w-full justify-between">
      <div className="relative w-full">
        <Input
          min={min}
          type={inputType}
          className="h-7 rounded-r-none"
          value={innerValue}
          onChange={(e) => {
            setInnerValue(e.target.value);
            onInputChange(e.target.value);
          }}
          disabled={!editMode}
          ref={inputRef}
          onKeyDown={numberInputValidator}
          onPaste={numberInputPasteValidator}
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
          className="h-7 w-7 p-0 rounded-l-none"
          onClick={turnOnEditMode}
        >
          <Pencil1Icon />
        </Button>
      ) : (
        <SmallActionButtons
          tooltipContent={disabled ? "Copy to clipboard" : undefined}
          checkIcon={disabled ? <CopyIcon /> : undefined}
          isCheckBtnDisabled={!isDirty}
          onCrossClick={() => {
            setEditMode(false);
            setInnerValue(value);
            onInputChange(null);
          }}
          onCheckClick={() => {
            setEditMode(false);
            if (disabled) {
              vimOs.utils.copyToClipboard(value ?? "");
              toast({
                variant: "default",
                title: "Copied to clipboard",
              });
            } else {
              onChange(innerValue);
              onInputChange(null);
            }
          }}
        />
      )}
    </div>
  );
};
