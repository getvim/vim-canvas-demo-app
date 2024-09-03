import { Input } from "@/components/ui/input";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SmallActionButtons } from "../ui/smallActionButtons";
import { UpdateField } from "../update-fields/types";

export const InputField = ({
  value,
  onChange,
  disabled,
}: UpdateField<string | undefined>) => {
  const [innerValue, setInnerValue] = useState(value);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className="flex w-full justify-between">
      <Input
        className="h-7 rounded-r-none"
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        disabled={disabled || !editMode}
      />
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
          onCrossClick={() => {
            setEditMode(false);
            setInnerValue(value);
          }}
          onCheckClick={() => {
            setEditMode(false);
            onChange(innerValue);
          }}
        />
      )}
    </div>
  );
};
