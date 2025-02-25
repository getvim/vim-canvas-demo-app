import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChromePicker, ColorResult } from "react-color";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
}) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  // Handle clicking outside of the color picker to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className="flex items-center relative">
      <div
        className="w-16 h-16 mr-2 rounded border border-gray-300 cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => setShowColorPicker(!showColorPicker)}
      ></div>
      <input
        type="text"
        value={color}
        onChange={handleInputChange}
        className="border border-gray-300 rounded px-4 py-2 w-40"
      />

      {showColorPicker && (
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
