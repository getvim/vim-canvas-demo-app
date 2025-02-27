export const saveSettings = (settings: object) => {
  console.log("call backend to save settings: ", settings);
};

export const loadSettings = (): object => {
  console.log("call backend to load settings");
  return { "123": { appColor: "#00FFE1" } };
};
