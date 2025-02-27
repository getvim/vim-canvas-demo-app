import React, { useCallback, useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { VimConnectPreview } from "./VimConnectPreview";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { saveSettings } from "../../utils/storage";

interface BrandCustomizationFormProps {
  appColor: string;
  onColorChange: (color: string) => void;
  onSave: () => void;
}

const BrandCustomizationForm: React.FC<BrandCustomizationFormProps> = ({
  appColor,
  onColorChange,
  onSave,
}) => {
  return (
    <div className="w-full a">
      <div className="mb-8">
        <label className="block text-lg font-medium mb-4">
          Select your app color:
        </label>
        <ColorPicker color={appColor} onChange={onColorChange} />
      </div>

      <button
        onClick={onSave}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-12 rounded w-48"
      >
        Save
      </button>
    </div>
  );
};

export const BrandCustomization: React.FC = () => {
  const [appColor, setAppColor] = useState<string>("#00FFE1");
  const organizationId = useOrganizationContext();

  const handleSave = useCallback(() => {
    saveSettings({ [organizationId]: { appColor } });
  }, [organizationId, appColor]);

  return (
    <div className="w-full max-w-6xl mx-auto p-[20px] font-proxima bg-white rounded-[10px]">
      <div className="text-sm font-bold mb-8">
        Customize Demo Canvas in-app experience to your organization branding
      </div>

      <div className="flex flex-row gap-8">
        <BrandCustomizationForm
          appColor={appColor}
          onColorChange={setAppColor}
          onSave={handleSave}
        />

        <div className="border-l-2 border-[#828282] self-stretch"></div>

        <div className="w-1/2 flex justify-center">
          <VimConnectPreview appColor={appColor} />
        </div>
      </div>
    </div>
  );
};
