import { useState, useEffect } from "react";
import { useController } from "react-hook-form";
import { Copy, Edit2, Save, AlertTriangle } from "lucide-react";
import { useNoteFormContext } from "@/providers/NoteFormContext";
import { useVimOsContext } from "@/providers/VimOSContext";
import { Button } from "../atoms/Button";
import { IconButton } from "../atoms/IconButton";
import { Textarea } from "../atoms/Textarea";
import { sanitizeEhrText, type TextSanitizationResult } from "@/lib/sanitizeEhrText";

type FieldName = "subjective" | "objective" | "assessment" | "plan";

interface SoapSectionProps {
  title: string;
  fieldName: FieldName;
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
  const { control } = useNoteFormContext();
  const {
    field: { value, onChange },
  } = useController({
    name: fieldName,
    control,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [sanitizeResult, setSanitizeResult] = useState<TextSanitizationResult | null>(null);

  // Keep editValue in sync with form value
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleCopyToClipboard = (): void => {
    vimOS.utils.copyToClipboard(value);

    try {
      vimOS.hub.pushNotification.show({
        text: `${title} copied to clipboard!`,
        notificationId: crypto.randomUUID(),
      });
    } catch (e) {
      console.error("failed to show push notification", e);
    }
  };

  const handleEditClick = () => {
    setEditValue(value);
    setIsEditing(true);
    setSanitizeResult(null);
  };

  const handleSaveClick = () => {
    const result = sanitizeEhrText(editValue);
    if (result.hasChanges) {
      setSanitizeResult(result);
      setEditValue(result.sanitizedText);
    } else {
      onChange(editValue);
      setIsEditing(false);
      setSanitizeResult(null);
    }
  };

  const handleConfirmSanitizedSave = () => {
    if (sanitizeResult) {
      onChange(sanitizeResult.sanitizedText);
      setIsEditing(false);
      setSanitizeResult(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Save on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSaveClick();
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
      setSanitizeResult(null);
    }
  };

  const handleTextClick = (e: React.MouseEvent) => {
    // Don't enter edit mode if user is selecting text
    if (window.getSelection()?.toString()) {
      return;
    }
    
    // Don't enter edit mode if clicking on a keyword
    const target = e.target as HTMLElement;
    if (target.hasAttribute("data-keyword")) {
      return;
    }

    handleEditClick();
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-colors ${
        isHighlighted ? "ring-2 ring-green-500" : ""
      } `}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <IconButton
            Icon={isEditing ? Save : Edit2}
            active={true}
            onClick={isEditing ? handleSaveClick : handleEditClick}
          />
        </div>
        <div 
          className="text-gray-700 text-lg whitespace-pre-line"
          onClick={!isEditing ? handleTextClick : undefined}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editValue}
                onChange={(e) => {
                  setEditValue(e.target.value);
                  setSanitizeResult(null);
                }}
                onKeyDown={handleKeyDown}
                className="min-h-[200px] text-lg"
                placeholder={`Enter ${title.toLowerCase()} notes here...`}
                autoFocus
              />
              {sanitizeResult && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800">Unsupported Characters Detected</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        The following characters will be replaced for EHR compatibility:
                      </p>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                    {sanitizeResult.explanationList.map((replacement, index) => (
                      <li key={index}>
                        "{replacement.original}" will be replaced with "{replacement.replacement}"
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleConfirmSanitizedSave}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => setSanitizeResult(null)}
                      variant="ghost"
                      className="text-yellow-700 hover:bg-yellow-100"
                    >
                      Keep Editing
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="cursor-pointer p-3 border border-green-300 rounded-xl">
              {renderHighlightedText(value)}
            </div>
          )}
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
