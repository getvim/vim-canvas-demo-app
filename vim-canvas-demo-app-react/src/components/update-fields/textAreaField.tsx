import { Textarea } from "@/components/ui/textarea";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { UpdateField } from "../update-fields/types";
import { useVimOsContext } from "@/hooks/useVimOsContext";

export const TextareaField = ({
  id,
  value,
  onChange,
  disabled,
  clearAfterChange,
  placeholder,
}: UpdateField<string | undefined> & {
  clearAfterChange?: boolean;
  placeholder?: string;
}) => {
  const [innerValue, setInnerValue] = useState(value);
  const [editMode, setEditMode] = useState(false);
  const vimOs = useVimOsContext();
  const [key, setKey] = useState<number>(+new Date());

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className="flex w-full relative justify-between">
      <div className="relative w-full">
        <Textarea
          id={id}
          key={key}
          className="disabled:bg-secondary"
          placeholder={placeholder}
          value={innerValue}
          onChange={(e) => setInnerValue(e.target.value)}
          disabled={!editMode}
        />
        {!editMode && (
          <div
            onClick={() => setEditMode(true)}
            className="absolute top-0 left-0 w-full h-full"
          ></div>
        )}
      </div>
      {!editMode ? (
        <Button
          size={"sm"}
          variant={"ghost"}
          className="absolute right-2 top-2 h-7 w-7 p-0"
          disabled={disabled}
          onClick={() => setEditMode(true)}
        >
          <Pencil1Icon />
        </Button>
      ) : (
        <SmallActionButtons
          className="absolute -right-[16px] bottom-0"
          crossClassName="rounded-l-md rounded-es-none border-l-1"
          checkClassName="rounded-se-none"
          tooltipContent={disabled ? "Copy to clipboard" : undefined}
          onCrossClick={() => {
            setEditMode(false);
            setKey(+new Date());
            setInnerValue(value);
          }}
          onCheckClick={() => {
            setEditMode(false);
            if (disabled) {
              vimOs.utils.copyToClipboard(innerValue ?? "");
            } else {
              onChange(innerValue);
            }
            if (clearAfterChange) {
              setKey(+new Date());
              setInnerValue(undefined);
            }
          }}
        />
      )}
    </div>
  );
};
