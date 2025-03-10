interface TranscriptionSegment {
  text: string;
  timestamp: string;
  affectedSections: ("subjective" | "objective" | "assessment" | "plan")[];
}

interface TranscriptionPanelProps {
  segments: TranscriptionSegment[];
  hoveredSegment: number | null;
  onHoverSegment: (index: number | null) => void;
}

export const TranscriptionPanel = ({
  segments,
  hoveredSegment,
  onHoverSegment,
}: TranscriptionPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Raw Transcription</h3>
        <div className="text-sm text-gray-500">Timeline</div>
      </div>
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-colors ${
              hoveredSegment === index
                ? "bg-green-50 shadow-sm"
                : "hover:bg-gray-50"
            }`}
            onMouseEnter={() => onHoverSegment(index)}
            onMouseLeave={() => onHoverSegment(null)}
          >
            <div className="flex flex-col items-start space-x-3">
              <div className="text-sm font-medium text-gray-500 w-16 flex-shrink-0">
                {segment.timestamp}
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{segment.text}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {segment.affectedSections.map((section) => (
                    <span
                      key={section}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
