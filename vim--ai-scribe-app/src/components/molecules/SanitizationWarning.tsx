import { type Dispatch, type SetStateAction } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../atoms/Button";
import {
    type TextSanitizationResult
} from "@/lib/sanitizeEhrText";

export const SanitizationWarning = ({
  sanitizeResult,
  handleConfirmSanitizedSave,
  setSanitizeResult,
}: {
  sanitizeResult: TextSanitizationResult | null;
  handleConfirmSanitizedSave: () => void;
  setSanitizeResult: Dispatch<SetStateAction<TextSanitizationResult | null>>;
}) => {
  if (!sanitizeResult) {
    return null;
  }
  return (
    <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800">
            Unsupported Characters Detected
          </h4>
          <p className="text-sm text-yellow-700 mt-1">
            The following characters will be replaced for EHR compatibility:
          </p>
        </div>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-yellow-700">
        {sanitizeResult.explanationList.map((replacement, index) => (
          <li key={index}>
            "{replacement.original}" will be replaced with "
            {replacement.replacement}"
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
  );
};
