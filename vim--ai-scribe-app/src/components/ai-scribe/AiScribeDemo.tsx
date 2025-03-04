import { useState, useEffect } from "react";
import {
  User,
  Clock,
  Mic,
  FileText,
  MessageSquare,
  X,
  Search,
  Bug,
} from "lucide-react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { RecordingPanel } from "../organisms/RecordingPanel";
import { NotePanel } from "../organisms/NotePanel";
import { MainLayout } from "../templates/MainLayout";
import { DebugView } from "../templates/DebugView";
import { ICD_CODES } from "./icdCodes.mock";
import { MOCK_TRANSCRIPTION } from "./transcription.mock";
import { MEDICAL_KEYWORDS } from "./keywords.mock";

interface Note {
  id: string;
  patientName: string;
  timestamp: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

type TabType = "record" | "notes" | "user";

export const AiScribeDemo = () => {
  const [activeTab, setActiveTab] = useState<TabType>("record");
  const [notes, setNotes] = useState<Note[]>([]);
  const [patientName, setPatientName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([]);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const hasCurrentNote = Boolean(
    currentNote.subjective ||
      currentNote.objective ||
      currentNote.assessment ||
      currentNote.plan
  );

  const handleTabChange = (tab: TabType) => {
    if (tab === "notes" && !hasCurrentNote) {
      return;
    }
    setActiveTab(tab);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
  };

  const handleEndVisit = () => {
    setIsProcessing(true);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setTimeout(() => {
      const newNote = {
        subjective:
          "Patient reports experiencing colic pain on both sides of the lower abdomen for the past two days. The pain is described as intermittent, sharp, and cramping in nature. The patient rates the pain as 6/10 in intensity.",
        objective:
          "Vital signs stable. BP 120/80, HR 72, RR 16, Temp 98.6°F. Abdomen tender to palpation bilaterally in lower quadrants. No rebound tenderness or guarding. Bowel sounds normal.",
        assessment:
          "Acute abdominal pain, likely due to gastroenteritis or menstrual cramps. No signs of acute surgical abdomen.",
        plan: "1. Prescribed antispasmodics for pain relief\n2. Recommended clear liquid diet for 24 hours\n3. Return if pain worsens or new symptoms develop\n4. Follow up in 3 days if symptoms persist",
      };

      const savedNote: Note = {
        id: Date.now().toString(),
        patientName,
        timestamp: new Date().toLocaleString(),
        soap: newNote,
      };

      setNotes((prevNotes) => [savedNote, ...prevNotes]);
      setCurrentNote(newNote);
      setIsProcessing(false);
      setActiveTab("notes");
    }, 3000);
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    setIcdSearchQuery("");
    setSelectedIcdCodes([]);
  };

  const handleIcdCodeToggle = (code: string) => {
    setSelectedIcdCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handlePushIcdCodes = () => {
    console.log("Pushing ICD codes:", selectedIcdCodes);
    setSelectedKeyword(null);
    setSelectedIcdCodes([]);
  };

  const handlePushToEHR = () => {
    console.log("Pushing to EHR - to be implemented");
  };

  const filteredIcdCodes = (keyword: string) => {
    const codes = ICD_CODES[keyword] || [];
    if (!icdSearchQuery) return codes;

    return codes.filter(
      (code) =>
        code.code.toLowerCase().includes(icdSearchQuery.toLowerCase()) ||
        code.description.toLowerCase().includes(icdSearchQuery.toLowerCase())
    );
  };

  const highlightKeywords = (text: string) => {
    let highlightedText = text;
    MEDICAL_KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        (match) =>
          `<span class="bg-green-100 cursor-pointer hover:bg-green-200 rounded px-1" data-keyword="${match.toLowerCase()}">${match}</span>`
      );
    });
    return highlightedText;
  };

  const renderHighlightedText = (text: string) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: highlightKeywords(text) }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.hasAttribute("data-keyword")) {
            handleKeywordClick(target.getAttribute("data-keyword")!);
          }
        }}
      />
    );
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      hasCurrentNote={hasCurrentNote}
    >
      <div className="space-y-6">
        {activeTab === "record" && !isRecording && !isProcessing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Start New Recording
                </h2>
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              <Input
                value={patientName}
                onChange={setPatientName}
                placeholder="Enter patient name"
              />

              <Button
                onClick={simulateRecording}
                disabled={!patientName.trim()}
                fullWidth
                className="mt-4 py-4"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            </div>
          </div>
        )}

        {activeTab === "record" && isProcessing && (
          <div className="flex flex-col items-center justify-center space-y-12 pt-12">
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-black shadow-lg flex items-center justify-center animate-pulse-green">
                  <div className="w-32 h-32 rounded-full bg-black/80 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-green-500 border-t-transparent animate-spin-slow" />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Processing
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold text-green-800">
                  Transcribing audio...
                </h2>
                <p className="text-gray-600">
                  This usually takes about 30 seconds
                </p>
              </div>
            </div>

            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <p className="text-xl text-gray-700 mb-4">
                  While we process your recording
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">
                      Your note is being transcribed and formatted into SOAP
                      sections
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">
                      Medical terms are being identified and linked to ICD codes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-600">
                      The note will be ready for your review in moments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "record" && isRecording && !isProcessing && (
          <RecordingPanel
            isPaused={isPaused}
            recordingTime={recordingTime}
            onPausePlay={handlePausePlay}
            onEndVisit={handleEndVisit}
            formatTime={formatTime}
          />
        )}

        {activeTab === "notes" && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">
                {patientName || "Patient Name"}
              </h2>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsDebugMode(!isDebugMode)}
                  variant={isDebugMode ? "primary" : "ghost"}
                  className={
                    isDebugMode ? "bg-purple-500 hover:bg-purple-600" : ""
                  }
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Debug Mode
                </Button>
                <div className="text-sm text-gray-500">
                  Note saved automatically
                </div>
                <Button onClick={handlePushToEHR}>Push all to EHR</Button>
              </div>
            </div>

            {isDebugMode ? (
              <DebugView
                transcriptionSegments={MOCK_TRANSCRIPTION}
                hoveredSegment={hoveredSegment}
                onHoverSegment={setHoveredSegment}
                currentNote={currentNote}
                onPushToEHR={handlePushToEHR}
                renderHighlightedText={renderHighlightedText}
              />
            ) : (
              <NotePanel
                note={currentNote}
                hoveredSegment={hoveredSegment}
                transcriptionSegments={MOCK_TRANSCRIPTION}
                onPushToEHR={handlePushToEHR}
                renderHighlightedText={renderHighlightedText}
              />
            )}
          </>
        )}

        {activeTab === "user" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Previous Notes
            </h2>
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-900">
                      {note.patientName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {note.timestamp}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <details className="text-sm">
                      <summary className="font-medium text-green-600 cursor-pointer hover:text-green-800">
                        View SOAP Note
                      </summary>
                      <div className="mt-4 space-y-4 pl-4">
                        {Object.entries(note.soap).map(([key, value]) => (
                          <div key={key}>
                            <h4 className="font-medium text-gray-700 capitalize">
                              {key}
                            </h4>
                            <div className="text-gray-600 mt-1">
                              {renderHighlightedText(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-3" />
                  <p>No saved notes yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedKeyword && ICD_CODES[selectedKeyword] && (
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
                    Keyword:{" "}
                    <span className="font-medium">{selectedKeyword}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedKeyword(null)}
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
                      <div className="font-medium text-gray-900">
                        {icd.code}
                      </div>
                      <div className="text-sm text-gray-600">
                        {icd.description}
                      </div>
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
      )}
    </MainLayout>
  );
};
