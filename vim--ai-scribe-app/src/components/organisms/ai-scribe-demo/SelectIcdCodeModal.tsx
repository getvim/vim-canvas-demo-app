import { useState } from "react";
import { X, Search } from "lucide-react";
import { ICD_CODES } from "./icdCodes.mock";

export const SelectIcdCodeModal = ({
  selectedKeyword,
  handleSubmit,
  closeModal,
}: {
  selectedKeyword: string;
  handleSubmit: (icdCodes: string[]) => void;
  closeModal: () => void;
}) => {
  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([]);

  const handleIcdCodeToggle = (code: string) => {
    setSelectedIcdCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handlePushIcdCodes = () => {
    handleSubmit(selectedIcdCodes);

    setIcdSearchQuery("");
    setSelectedIcdCodes([]);
  };

  if (!ICD_CODES[selectedKeyword]) {
    return null;
  }

  const filteredIcdCodes = (keyword: string) => {
    const codesList = ICD_CODES[keyword] || [];

    if (!icdSearchQuery) {
      return codesList;
    }

    const filteredCodesList = codesList.filter(
      (code) =>
        code.code.toLowerCase().includes(icdSearchQuery.toLowerCase()) ||
        code.description.toLowerCase().includes(icdSearchQuery.toLowerCase())
    );

    return filteredCodesList;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Select ICD Codes
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Keyword: <span className="font-medium">{selectedKeyword}</span>
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={icdSearchQuery}
              onChange={(e) => setIcdSearchQuery(e.target.value)}
              placeholder="Search for ICD Code"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredIcdCodes(selectedKeyword).map((icd) => (
            <div
              key={icd.code}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleIcdCodeToggle(icd.code)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors ${
                    selectedIcdCodes.includes(icd.code)
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedIcdCodes.includes(icd.code) && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{icd.code}</div>
                  <div className="text-sm text-gray-600">{icd.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handlePushIcdCodes}
            disabled={selectedIcdCodes.length === 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedIcdCodes.length > 0
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Push to EHR
          </button>
        </div>
      </div>
    </div>
  );
};
