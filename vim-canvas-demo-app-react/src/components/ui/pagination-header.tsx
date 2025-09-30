interface PaginationHeaderProps {
  currentPage: number;
  totalPageNumber: number;
  totalItems: number;
  numberOfFetchedItems: number;
  enhancement: string;
}

export const PaginationHeader = ({
  currentPage,
  totalPageNumber,
  totalItems,
  numberOfFetchedItems,
  enhancement,
}: PaginationHeaderProps) => {
  const progressPercentage = Math.round(
    (numberOfFetchedItems / totalItems) * 100
  );
  const completedDots = Math.round((progressPercentage / 100) * 12);
  const totalDots = 12;

  return (
    <div className="flex flex-col items-center space-y-2 py-4">
      {/* Page Number Display */}
      <div className="text-lg font-bold">
        Page {currentPage} of {totalPageNumber}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm">Progress:</span>
        <div className="flex space-x-1">
          {Array.from({ length: totalDots }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < completedDots ? "bg-blue-400" : "bg-black"
              }`}
            />
          ))}
        </div>
        <span className="text-sm">{progressPercentage}% complete</span>
      </div>

      {/* Loaded Items Count */}
      <div className="text-sm">
        {numberOfFetchedItems} of {totalItems} {enhancement} results loaded
      </div>
    </div>
  );
};
