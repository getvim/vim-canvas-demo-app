import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { DatePicker } from "@/components/update-fields/datePicker";
import { format } from "date-fns";
import { EntityFieldTitle } from "../ui/entityContent";
import { Loading } from "../ui/loading";

interface PaginationInputProps {
  actionName: string;
  onActionClick: (fromDate: string, untilDate: string) => void;
  isLoading?: boolean;
}

export const PaginationInput = ({
  actionName,
  onActionClick,
  isLoading = false,
}: PaginationInputProps) => {
  const [fromDate, setFromDate] = useState<Date>(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return thirtyDaysAgo;
  });
  const [untilDate, setUntilDate] = useState<Date>(() => new Date());

  const handleActionClick = useCallback(() => {
    const fromDateString = fromDate ? format(fromDate, "yyyy-MM-dd") : "";
    const untilDateString = untilDate ? format(untilDate, "yyyy-MM-dd") : "";
    onActionClick(fromDateString, untilDateString);
  }, [fromDate, untilDate, onActionClick]);

  const handleFromDateChange = useCallback((date: Date | undefined) => {
    if (date) {
      setFromDate(date);
    }
  }, []);

  const handleUntilDateChange = useCallback((date: Date | undefined) => {
    if (date) {
      setUntilDate(date);
    }
  }, []);

  const handleNoOp = useCallback(() => {}, []);

  return (
    <div className="space-y-4">
      <EntityFieldTitle title="From date" />
      <DatePicker
        hideActionButtons={true}
        value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
        isDirty={Boolean(fromDate)}
        disabled={false}
        onChange={handleNoOp}
        onDateChange={handleFromDateChange}
      />

      <EntityFieldTitle title="Until date" />
      <DatePicker
        hideActionButtons={true}
        value={untilDate ? format(untilDate, "yyyy-MM-dd") : ""}
        isDirty={Boolean(untilDate)}
        onChange={handleNoOp}
        onDateChange={handleUntilDateChange}
      />

      <Button
        onClick={handleActionClick}
        disabled={isLoading}
        className="w-full bg-white border-2 border-black text-gray-800 hover:bg-gray-50 disabled:opacity-50"
      >
        {isLoading ? <Loading /> : `Get specific time ${actionName}`}
      </Button>
    </div>
  );
};
