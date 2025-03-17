import type { FC, PropsWithChildren } from "react";
import { VimOSContextProvider } from "./VimOSContext";
import { NoteFormContext, useNoteForm } from "./NoteFormContext";

export const AppContextProviders: FC<PropsWithChildren> = ({ children }) => {
  const methods = useNoteForm();
  
  return (
    <VimOSContextProvider>
      <NoteFormContext.Provider value={methods}>
        {children}
      </NoteFormContext.Provider>
    </VimOSContextProvider>
  );
};
