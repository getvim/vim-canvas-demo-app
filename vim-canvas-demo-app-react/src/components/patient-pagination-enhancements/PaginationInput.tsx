import { useState } from "react";
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
  const today = new Date();
  const defaultFromDate = () => {
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return thirtyDaysAgo;
  };
  const defaultUntilDate = () => {
    return today;
  };
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate());
  const [untilDate, setUntilDate] = useState<Date>(defaultUntilDate());

  const handleActionClick = () => {
    const fromDateString = fromDate ? format(fromDate, "yyyy-MM-dd") : "";
    const untilDateString = untilDate ? format(untilDate, "yyyy-MM-dd") : "";
    onActionClick(fromDateString, untilDateString);
  };

  return (
    <div className="space-y-4">
      <EntityFieldTitle title="From date" />
      <DatePicker
        hideActionButtons={true}
        value={fromDate ? format(fromDate, "yyyy-MM-dd") : ""}
        isDirty={Boolean(fromDate)}
        disabled={false}
        onChange={() => {}}
        onDateChange={(date) => {
          if (date) {
            setFromDate(date);
          } else if (fromDate) {
            setFromDate(fromDate);
          }
        }}
      />

      <EntityFieldTitle title="Until date" />
      <DatePicker
        hideActionButtons={true}
        value={untilDate ? format(untilDate, "yyyy-MM-dd") : ""}
        isDirty={Boolean(untilDate)}
        onChange={() => {}}
        onDateChange={(date) => {
          if (date) {
            setUntilDate(date);
          } else if (untilDate) {
            setUntilDate(untilDate);
          }
        }}
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
