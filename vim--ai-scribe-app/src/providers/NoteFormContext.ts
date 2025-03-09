import { useForm, UseFormReturn } from "react-hook-form";
import { createContext, useContext } from "react";

export interface NoteFormData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const useNoteForm = () => {
  return useForm<NoteFormData>({
    defaultValues: {
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    },
  });
};

export const NoteFormContext = createContext<UseFormReturn<NoteFormData> | null>(null);

export const useNoteFormContext = () => {
  const context = useContext(NoteFormContext);
  if (!context) {
    throw new Error("useNoteFormContext must be used within a NoteFormProvider");
  }
  return context;
}; 