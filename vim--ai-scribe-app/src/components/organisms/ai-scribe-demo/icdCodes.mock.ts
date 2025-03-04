interface IcdCode {
  code: string;
  description: string;
}

export const ICD_CODES: Record<string, IcdCode[]> = {
  "colic pain": [
    {
      code: "3074F",
      description: "Most recent systolic BP less than 130 mm Hg",
    },
    { code: "3075F", description: "Most recent systolic BP 130-139 mm Hg" },
    {
      code: "3077F",
      description: "Most recent systolic BP greater than or equal to 140 mm Hg",
    },
    {
      code: "3078F",
      description: "Most recent diastolic BP less than 80 mm Hg",
    },
  ],
  "abdominal pain": [
    { code: "R10.9", description: "Unspecified abdominal pain" },
    { code: "R10.84", description: "Generalized abdominal pain" },
    { code: "R10.30", description: "Lower abdominal pain, unspecified" },
  ],
  intermittent: [
    { code: "R10.83", description: "Intermittent abdominal pain" },
    {
      code: "G44.221",
      description: "Intermittent chronic tension-type headache",
    },
  ],
  "sharp pain": [
    { code: "R52", description: "Acute pain" },
    { code: "M25.50", description: "Sharp pain in unspecified joint" },
  ],
  cramping: [
    { code: "R25.2", description: "Muscle cramping" },
    { code: "G44.1", description: "Vascular headache with cramping" },
  ],
  gastroenteritis: [
    { code: "A09", description: "Infectious gastroenteritis and colitis" },
    { code: "K52.9", description: "Noninfective gastroenteritis and colitis" },
  ],
  "menstrual cramps": [
    { code: "N94.6", description: "Dysmenorrhea, unspecified" },
    { code: "N94.4", description: "Primary dysmenorrhea" },
  ],
};
