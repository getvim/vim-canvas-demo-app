import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChromePicker, ColorResult } from "react-color";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const useColorPickerModal = ({
  onChange,
}: {
  onChange: (color: string) => void;
}) => {
  const [showColorPickerModal, setShowColorPickerModal] =
    useState<boolean>(false);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  // Handle clicking outside of the color picker to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPickerModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorChange = useCallback(
    (newColor: ColorResult) => {
      onChange(newColor.hex);
    },
    [onChange]
  );

  return {
    colorPickerRef,
    showColorPickerModal,
    setShowColorPickerModal,
    handleColorChange,
  };
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
}) => {
  const {
    colorPickerRef,
    showColorPickerModal,
    setShowColorPickerModal,
    handleColorChange,
  } = useColorPickerModal({ onChange });

  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="flex items-center relative mt-2">
      <div className="flex gap-8 rounded border border-solid border-[#00142a] ">
        <svg
          className="cursor-pointer"
          onClick={() => setShowColorPickerModal(!showColorPickerModal)}
          xmlns="http://www.w3.org/2000/svg"
          width="130"
          height="30"
          fill="none"
        >
          <rect
            fill={color}
            width="30"
            height="32"
            x="-0.5"
            y="-1"
            stroke="#00142A"
            rx="4"
          />
        </svg>
        <input
          type="text"
          value={color}
          onChange={handleTextInputChange}
          className="bg-transparent w-20 text-center text-sm font-normal underline decoration-1 absolute left-[40px] top-[7px]"
        />
      </div>

      {showColorPickerModal && (
        <div ref={colorPickerRef} className="absolute top-20 left-0 z-10">
          <ChromePicker
            color={color}
            onChange={handleColorChange}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};
