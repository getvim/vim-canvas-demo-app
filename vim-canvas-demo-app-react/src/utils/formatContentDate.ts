import { format } from "date-fns";

export const formatContentDate = (date: string | undefined) => {
  if (!date) return;

  return format(new Date(date), "MM/dd/yyyy");
};
