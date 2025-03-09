import { Copy } from "lucide-react";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { useVimOsContext } from "@/providers/VimOSContext";
import { useNoteFormContext } from "@/providers/NoteFormContext";

interface SoapSectionProps {
  title: string;
  fieldName: "subjective" | "objective" | "assessment" | "plan";
  onPushToEHR?: () => void;
  isHighlighted?: boolean;
  renderHighlightedText: (text: string) => JSX.Element;
}

export const SoapSection = ({
  title,
  fieldName,
  onPushToEHR = () => {},
  isHighlighted = false,
  renderHighlightedText,
}: SoapSectionProps) => {
  const vimOS = useVimOsContext();
  const { watch } = useNoteFormContext();
  const content = watch(fieldName);

  const handleCopyToClipboard = (): void => {
    vimOS.utils.copyToClipboard(content);

    try {
      vimOS.hub.pushNotification.show({
        text: `${title} copied to clipboard!`,
        notificationId: crypto.randomUUID(),
      });
    } catch (e) {
      console.error("failed to show push notification", e);
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-colors ${
        isHighlighted ? "ring-2 ring-green-500" : ""
      } `}
    >
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="text-gray-700 text-lg whitespace-pre-line">
          {renderHighlightedText(content)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 justify-around p-4 mb-4">
        <Button
          onClick={() => {
            onPushToEHR();
          }}
          fullWidth
          className="py-3 w-2/3 self-center"
        >
          Push to EHR
        </Button>
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={handleCopyToClipboard}
        >
          <IconButton Icon={Copy} active={true} />
          <span className="text-green-500">Copy</span>
        </div>
      </div>
    </div>
  );
};
