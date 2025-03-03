import { Settings } from "../../types";

export const saveSettings = async (settings: Settings) => {
  await fetch("api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
};

export const loadSettings = async (
  organizationId: string
): Promise<Settings> => {
  const res = await fetch(`/api/settings/${organizationId}`, { method: "GET" });
  return res.json();
};
