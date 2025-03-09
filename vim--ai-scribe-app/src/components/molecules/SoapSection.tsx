import { ClipboardCopy } from "lucide-react";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { useVimOsContext } from "@/providers/VimOSContext";

interface SoapSectionProps {
  title: string;
  content: string;
  onPushToEHR?: () => void;
  isHighlighted?: boolean;
  renderHighlightedText: (text: string) => JSX.Element;
}

export function SoapSection({
  title,
  content,
  onPushToEHR = () => {},
  isHighlighted = false,
  renderHighlightedText,
}: SoapSectionProps) {
  const vimOS = useVimOsContext();

  const handleCopyToClipboard = (): void => {
    vimOS.utils.copyToClipboard(content);
    
    // TODO debug why notification not showing
    try {
      vimOS.hub.pushNotification.show({
        text: `Bla Bla!`,
        notificationId: crypto.randomUUID(),
      });
    } catch (e) {
      console.error("failed to show push notification", e);
    }
  }

  return (
    <div
      className={`flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-colors ${
        isHighlighted ? "ring-2 ring-green-500" : ""
      } `}
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 text-lg">
          {renderHighlightedText(content)}
        </div>
      </div>
      <div className="flex justify-around m-2 mb-4">
        <Button
          onClick={() => {
            onPushToEHR();
          }}
          fullWidth
          className="py-3 w-2/3 self-center"
        >
          Push to EHR
        </Button>
        <IconButton
          className=""
          Icon={ClipboardCopy}
          active={true}
          onClick={handleCopyToClipboard}
        />
      </div>
    </div>
  );
}
