import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useAuthTokenData } from "@/hooks/useAuthTokenData";
import { saveSettings, loadSettings } from "../../utils/settings-api";
import { VimConnectPreview } from "./VimConnectPreview";
import { ColorPicker } from "./ColorPicker";

const defaultSettings = { theme_color: "#00FFE1", adapter_actions_enabled: false };

export const BrandCustomization = () => {
  const { idToken } = useAuthTokenData();
  const [savedSettings, setSavedSettings] = useState<typeof defaultSettings>();
  const [settings, setSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    if (!idToken) return;

    let active = true;
    setSavedSettings(undefined);
    setSaved(false);
    setSettingsError("");
    loadSettings(idToken)
      .then((data) => {
        if (!active) return;
        const loaded = {
          theme_color: data?.theme_color || defaultSettings.theme_color,
          adapter_actions_enabled: data?.adapter_actions_enabled === true,
        };
        setSavedSettings(loaded);
        setSettings(loaded);
      })
      .catch((error) => {
        console.error("Failed to load settings", error);
        if (active) setSettingsError("Couldn’t load settings. Reopen this page to try again.");
      });

    return () => {
      active = false;
    };
  }, [idToken]);

  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saved]);

  if (!savedSettings) {
    return settingsError ? <p role="alert">{settingsError}</p> : <div>Loading...</div>;
  }

  const hasChanges =
    settings.theme_color !== savedSettings.theme_color ||
    settings.adapter_actions_enabled !== savedSettings.adapter_actions_enabled;
  const saveDisabled = !hasChanges || isSaving;

  const updateSettings = (change: Partial<typeof defaultSettings>) => {
    if (isSaving) return;
    setSettings((current) => ({ ...current, ...change }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSettingsError("");
    try {
      await saveSettings(settings, idToken);
      setSavedSettings(settings);
      setSaved(true);
    } catch (error) {
      console.error("Failed to save settings", error);
      setSettingsError("Couldn’t save settings. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full p-5 font-proxima rounded-xl bg-white h-full">
      <div className="font-proxima text-sm leading-4 font-bold text-left mb-1">
        Configure Demo Canvas for your organization
      </div>

      <div className="grid grid-cols-[267px_9px_268px] gap-4 mt-5 h-[95%]">
        <div>
          <fieldset disabled={isSaving}>
            <label className="text-left text-sm font-bold">
              Select your app color:
            </label>
            <ColorPicker
              color={settings.theme_color}
              onChange={(color) => updateSettings({ theme_color: color })}
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <label htmlFor="adapter-actions-enabled" className="text-sm font-bold">
                Enable Adapter Actions
              </label>
              <Switch
                id="adapter-actions-enabled"
                checked={settings.adapter_actions_enabled}
                onCheckedChange={(enabled) => updateSettings({ adapter_actions_enabled: enabled })}
              />
            </div>
          </fieldset>

          <button
            className="mt-5 h-[34px] w-[100px] rounded-sm bg-[#001C36] text-center text-sm font-medium text-white hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={handleSave}
            disabled={saveDisabled}
          >
            {isSaving ? "Saving…" : saved ? "Saved!" : "Save"}
          </button>
          {settingsError && <p role="alert" className="mt-2 text-sm text-red-700">{settingsError}</p>}
        </div>

        <div className="mx-3 border-l-[1px] border-[#828282]"></div>

        <VimConnectPreview appColor={settings.theme_color} />
      </div>
    </div>
  );
};
