import { Settings } from "../../types";

export const saveSettings = async (settings: Settings, token: string) => {
  await fetch("api/settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(settings),
  });
};

export const loadSettings = async (token: string): Promise<Settings> => {
  const res = await fetch("/api/settings", {
    method: "GET",
    headers: { Authorization: token },
  });
  return res.json();
};
