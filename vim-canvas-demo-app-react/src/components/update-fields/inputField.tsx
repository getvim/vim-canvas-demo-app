import { Input } from "@/components/ui/input";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { UpdateField } from "../update-fields/types";
import { useVimOsContext } from "@/hooks/useVimOsContext";

export const InputField = ({
  value,
  onChange,
  disabled,
}: UpdateField<string | undefined>) => {
  const [innerValue, setInnerValue] = useState(value);
  const [editMode, setEditMode] = useState(false);
  const vimOs = useVimOsContext();

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className="flex w-full justify-between">
      <div className="relative w-full">
        <Input
          className="h-7 rounded-r-none"
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
          className="h-7 w-7 p-0 rounded-l-none"
          disabled={disabled}
          onClick={() => setEditMode(true)}
        >
          <Pencil1Icon />
        </Button>
      ) : (
        <SmallActionButtons
          tooltipContent={disabled ? "Copy to clipboard" : undefined}
          onCrossClick={() => {
            setEditMode(false);
            setInnerValue(value);
          }}
          onCheckClick={() => {
            setEditMode(false);
            if (disabled) {
              vimOs.utils.copyToClipboard(innerValue ?? "");
            } else {
              onChange(innerValue);
            }
          }}
        />
      )}
    </div>
  );
};
