import { useState, useEffect } from "react";

export const useRecorder = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const simulateRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  return {
    isPaused,
    setIsPaused,
    isRecording,
    setIsRecording,
    recordingTime,
    simulateRecording,
    stopRecording,
  };
};
