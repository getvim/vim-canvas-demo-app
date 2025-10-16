import { useState } from "react";
import { Button } from "../ui/button";
import { CaretUpIcon } from "@radix-ui/react-icons";

interface CollapsibleHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const CollapsibleHeader = ({
  title,
  isOpen,
  onToggle,
  disabled = false,
}: CollapsibleHeaderProps) => {
  return (
    <Button
      onClick={disabled ? undefined : onToggle}
      variant="ghost"
      className="w-full h-[50px] flex items-center justify-between bg-white p-0 hover:bg-gray-50 disabled:cursor-not-allowed"
    >
      <div className="flex gap-2 items-center">
        <div className="flex flex-col items-start">
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CaretUpIcon
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </Button>
  );
};
