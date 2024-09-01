import { createContext, useState } from "react";

interface AppConfigContext {
  jsonMode: boolean;
  setJsonMode: (jsonMode: boolean) => void;
}

export const AppConfigContext = createContext<AppConfigContext>({
  jsonMode: false,
  setJsonMode: () => {},
});

export const AppConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [jsonMode, setJsonMode] = useState(false);

  return (
    <AppConfigContext.Provider
      value={{
        jsonMode,
        setJsonMode,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
