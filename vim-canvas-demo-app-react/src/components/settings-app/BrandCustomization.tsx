import React, { useCallback, useState } from "react";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";
import { saveSettings } from "../../utils/storage";
import { VimConnectPreview } from "./VimConnectPreview";
import { ColorPicker } from "./ColorPicker";

export const BrandCustomization: React.FC = () => {
  const [appColor, setAppColor] = useState<string>("#00FFE1");
  const organizationId = useOrganizationContext();

  const handleSave = useCallback(() => {
    saveSettings({ [organizationId]: { appColor } });
  }, [organizationId, appColor]);


  return (
    <div className="w-full p-5 font-proxima rounded-xl bg-white">
      <div className="font-proxima text-sm leading-4 font-bold text-left mb-1">
        Customize Demo Canvas in-app experience to your organization branding
      </div>

      <div className="grid grid-cols-[267px_9px_268px] gap-4 mt-5">
        <div>
          <div>
            <label className="text-left text-sm font-bold">
              Select your app color:
            </label>

            <ColorPicker color={appColor} onChange={setAppColor} />
          </div>

          <button
            className="mt-5 bg-gray-300 hover:bg-gray-400 text-white text-center text-sm font-medium rounded-sm w-[100px] h-[34px]"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        <div className="mx-3 border-l-[1px] border-[#828282]"></div>

        <VimConnectPreview appColor={appColor} />
      </div>
    </div>
  );
};
