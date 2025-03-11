import React, { useCallback, useEffect, useState } from "react";
import { useAuthTokenData } from "@/hooks/useAuthTokenData";
import { saveSettings, loadSettings } from "../../utils/settings-api";
import { VimConnectPreview } from "./VimConnectPreview";
import { ColorPicker } from "./ColorPicker";

export const BrandCustomization: React.FC = () => {
  const [appColor, setAppColor] = useState<string>("#00FFE1");
  const { idToken } = useAuthTokenData();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveButtonText, setSaveButtonText] = useState<string>("Save");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] =
    useState<boolean>(true);

  const handleSave = useCallback(() => {
    const save = async () => {
      try {
        await saveSettings(
          {
            theme_color: appColor,
          },
          idToken
        );
        setTimeout(() => {
          setSaveButtonText("Save");
        }, 2000);
        setIsSaveButtonDisabled(true);
        setSaveButtonText("Saved!");
      } catch (error) {
        console.error("Failed to save settings", error);
      }
    };
    save();
  }, [appColor, idToken]);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const settings = await loadSettings(idToken);
      setAppColor((prev) =>
        settings?.theme_color ? settings.theme_color : prev
      );
      setIsLoading(false);
    };

    if (idToken) {
      fetchSettings();
    }
  }, [idToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleColorChange = (color: string) => {
    setAppColor(color);
    setIsSaveButtonDisabled(false);
  };

  return (
    <div className="w-full p-5 font-proxima rounded-xl bg-white h-full">
      <div className="font-proxima text-sm leading-4 font-bold text-left mb-1">
        Customize Demo Canvas in-app experience to your organization branding
      </div>

      <div className="grid grid-cols-[267px_9px_268px] gap-4 mt-5 h-[95%]">
        <div>
          <div>
            <label className="text-left text-sm font-bold">
              Select your app color:
            </label>

            <ColorPicker color={appColor} onChange={handleColorChange} />
          </div>

          <button
            className="mt-5 hover:bg-gray-400 text-white text-center text-sm font-medium rounded-sm w-[100px] h-[34px]"
            onClick={handleSave}
            disabled={isSaveButtonDisabled}
            style={{
              cursor: isSaveButtonDisabled ? "not-allowed" : "pointer",
              backgroundColor: isSaveButtonDisabled ? "#D1D5DB" : "#001C36",
            }}
          >
            {saveButtonText}
          </button>
        </div>

        <div className="mx-3 border-l-[1px] border-[#828282]"></div>

        <VimConnectPreview appColor={appColor} />
      </div>
    </div>
  );
};
