import { Button } from '../atoms/Button';

interface SoapSectionProps {
  title: string;
  content: string;
  onPushToEHR: () => void;
  isHighlighted?: boolean;
  renderHighlightedText: (text: string) => JSX.Element;
}

export function SoapSection({
  title,
  content,
  onPushToEHR,
  isHighlighted = false,
  renderHighlightedText
}: SoapSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-colors ${
      isHighlighted ? 'ring-2 ring-green-500' : ''
    }`}>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 text-lg">
          {renderHighlightedText(content)}
        </div>
      </div>
      <Button
        onClick={onPushToEHR}
        fullWidth
        className="py-3"
      >
        Push to EHR
      </Button>
    </div>
  );
}