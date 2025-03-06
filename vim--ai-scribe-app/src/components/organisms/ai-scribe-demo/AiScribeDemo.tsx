import { useState } from "react";
import { Bug } from "lucide-react";
import { useUpdateEncounter } from "@/vimOs/useUpdateEncounter";
import { NavigationBar } from "@/components/molecules/NavigationBar";
import { Button } from "../../atoms/Button";
import { RecordingPanel } from "../recording-panel/RecordingPanel";
import { NotePanel } from "../note-panel/NotePanel";
import { DebugView } from "../../templates/DebugView";
import { MOCK_TRANSCRIPTION } from "./transcription.mock";
import { MEDICAL_KEYWORDS } from "./keywords.mock";
import { useRecorder } from "./useRecorder";
import { formatTime } from "../../../utils/formatTime.util";
import { RecordingTab } from "../RecordingTab/RecordingTab";
import { ProcessingTab } from "./ProcessingTab";
import {
  DiagnosisCodesModal,
  type DiagnosisCodesList,
} from "./DiagnosisCodesModal";
import type { Note } from "./Note.interface";
import { UserTab } from "./UserTab";
import { AppHeader } from "./AppHeader";

type TabType = "record" | "notes" | "user";

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

const useUpdateIcdCodes = () => {
  const { updateEncounter, checkCanUpdate } = useUpdateEncounter();

  const updateIcdCodes = (diagnosisCodes: DiagnosisCodesList) => {
    const updateOptions = checkCanUpdate({
      assessment: { diagnosisCodes: true },
    });
    const { canUpdate } = updateOptions;

    if (canUpdate) {
      updateEncounter({
        assessment: {
          diagnosisCodes,
        },
      });
    }
  };

  return { updateIcdCodes };
};

export const AiScribeDemo = () => {
  const [activeTab, setActiveTab] = useState<TabType>("record");
  const [notes, setNotes] = useState<Note[]>([]);
  const [patientName, setPatientName] = useState("");
  const {
    isPaused,
    setIsPaused,
    isRecording,
    recordingTime,
    simulateRecording,
    stopRecording,
  } = useRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  // const { updateEncounter, checkCanUpdate: canUpdate } = useUpdateEncounter();
  const { updateEncounter } = useUpdateEncounter();
  const { updateIcdCodes } = useUpdateIcdCodes();

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

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
  };

  const handleEndVisit = () => {
    stopRecording();
    setIsProcessing(true);

    setTimeout(() => {
      const newNote = {
        subjective:
          "Patient reports experiencing colic pain on both sides of the lower abdomen for the past two days. The pain is described as intermittent, sharp, and cramping in nature. The patient rates the pain as 6/10 in intensity.",
        objective:
          "Vital signs stable. BP 120/80, HR 72, RR 16, Temp 98.6F. Abdomen tender to palpation bilaterally in lower quadrants. No rebound tenderness or guarding. Bowel sounds normal.",
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

  const handleCloseModal = () => {
    console.log("Modal Closed");
    setSelectedKeyword(null);
  };

  const handleSubmitIcdCodes = (selectedIcdCodes: DiagnosisCodesList) => {
    console.log("Submitted ICD codes:", selectedIcdCodes);
    setSelectedKeyword(null);

    if (selectedIcdCodes?.length > 0) {
      updateIcdCodes(selectedIcdCodes);
    }
  };

  const handleFullEhrUpdate = async () => {
    const encounterPayload = {
      subjective: {
        generalNotes: currentNote.subjective,
      },
      objective: {
        generalNotes: currentNote.objective,
      },
      assessment: {
        generalNotes: currentNote.assessment,
      },
      plan: {
        generalNotes: currentNote.plan,
      },
    };

    try {
      await updateEncounter(encounterPayload);
      console.log("Successfully updated full encounter notes");
    } catch (error) {
      console.error("Failed to update encounter:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mb-24">
        <div className="space-y-6">
          {activeTab === "record" && !isRecording && !isProcessing && (
            <RecordingTab
              patientName={patientName}
              setPatientName={setPatientName}
              simulateRecording={simulateRecording}
            />
          )}

          {activeTab === "record" && isProcessing && <ProcessingTab />}

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
              <div className="flex flex-col justify-between items-center">
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
                  <Button onClick={() => handleFullEhrUpdate()}>
                    {/* TODO */}
                    Push all to EHR
                  </Button>
                </div>
              </div>

              {isDebugMode ? (
                <DebugView
                  transcriptionSegments={MOCK_TRANSCRIPTION}
                  hoveredSegment={hoveredSegment}
                  onHoverSegment={setHoveredSegment}
                  currentNote={currentNote}
                  renderHighlightedText={renderHighlightedText}
                />
              ) : (
                <NotePanel
                  note={currentNote}
                  hoveredSegment={hoveredSegment}
                  transcriptionSegments={MOCK_TRANSCRIPTION}
                  renderHighlightedText={renderHighlightedText}
                />
              )}
            </>
          )}

          {activeTab === "user" && (
            <UserTab
              notes={notes}
              renderHighlightedText={renderHighlightedText}
            />
          )}
        </div>

        {selectedKeyword && (
          <DiagnosisCodesModal
            selectedKeyword={selectedKeyword}
            closeModal={handleCloseModal}
            handleSubmit={handleSubmitIcdCodes}
          />
        )}
      </main>

      <NavigationBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasCurrentNote={hasCurrentNote}
      />
    </div>
  );
};
