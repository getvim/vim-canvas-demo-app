import { format } from "date-fns";

export const formatContentDate = (
  date: string | Date | undefined,
  options?: { format?: string }
) => {
  if (!date) return;

  return format(date, options?.format ?? "MM/dd/yyyy");
};
