export type SectionTypes = "subjective" | "objective" | "assessment" | "plan";

export interface TranscriptionSegment {
  text: string;
  timestamp: string;
  affectedSections: (SectionTypes)[];
}

export const MOCK_TRANSCRIPTION: TranscriptionSegment[] = [
  {
    text: "Patient presents with colic pain on both sides of the lower abdomen for two days.",
    timestamp: "00:05",
    affectedSections: ["subjective"],
  },
  {
    text: "The pain is intermittent, sharp, and cramping in nature.",
    timestamp: "00:12",
    affectedSections: ["subjective"],
  },
  {
    text: "Patient rates the pain as 6 out of 10 in intensity.",
    timestamp: "00:18",
    affectedSections: ["subjective"],
  },
  {
    text: "Vital signs are stable. Blood pressure 120/80.",
    timestamp: "00:25",
    affectedSections: ["objective"],
  },
  {
    text: "Heart rate 72, respiratory rate 16, temperature 98.6 Fahrenheit.",
    timestamp: "00:32",
    affectedSections: ["objective"],
  },
  {
    text: "Abdomen is tender to palpation bilaterally in lower quadrants.",
    timestamp: "00:40",
    affectedSections: ["objective"],
  },
  {
    text: "No rebound tenderness or guarding noted. Bowel sounds are normal.",
    timestamp: "00:48",
    affectedSections: ["objective"],
  },
  {
    text: "Assessment indicates acute abdominal pain.",
    timestamp: "00:55",
    affectedSections: ["assessment"],
  },
  {
    text: "Likely due to gastroenteritis or menstrual cramps.",
    timestamp: "01:02",
    affectedSections: ["assessment"],
  },
  {
    text: "No signs of acute surgical abdomen present.",
    timestamp: "01:08",
    affectedSections: ["assessment"],
  },
  {
    text: "Plan: Will prescribe antispasmodics for pain relief.",
    timestamp: "01:15",
    affectedSections: ["plan"],
  },
  {
    text: "Recommend clear liquid diet for the next 24 hours.",
    timestamp: "01:22",
    affectedSections: ["plan"],
  },
  {
    text: "Patient should return if pain worsens or new symptoms develop.",
    timestamp: "01:30",
    affectedSections: ["plan"],
  },
  {
    text: "Follow up in 3 days if symptoms persist.",
    timestamp: "01:38",
    affectedSections: ["plan"],
  },
];
