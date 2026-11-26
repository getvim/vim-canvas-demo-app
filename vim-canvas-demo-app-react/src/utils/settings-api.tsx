import { Settings } from "../../types";

export const saveSettings = async (settings: Settings, token: string) => {
  const res = await fetch("/api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
};

export const loadSettings = async (token: string): Promise<Settings | null> => {
  const res = await fetch("/api/settings", {
    method: "GET",
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
};
