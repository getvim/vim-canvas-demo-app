interface IcdCode {
  code: string;
  description: string;
}

export const ICD_CODES: Record<string, IcdCode[]> = {
  "colic pain": [
    { code: "R10.83", description: "Colic pain" },
    { code: "R10.84", description: "Generalized abdominal pain" },
    { code: "R10.9", description: "Unspecified abdominal pain" },
  ],
  "abdominal pain": [
    { code: "R10.9", description: "Unspecified abdominal pain" },
    { code: "R10.84", description: "Generalized abdominal pain" },
    { code: "R10.30", description: "Lower abdominal pain, unspecified" },
  ],
  intermittent: [
    { code: "R10.83", description: "Colic (intermittent) pain" },
    { code: "G44.221", description: "Chronic tension-type headache" },
  ],
  "sharp pain": [
    { code: "R52", description: "Pain, unspecified" },
    { code: "M25.50", description: "Pain in unspecified joint" },
  ],
  cramping: [
    { code: "R25.2", description: "Cramp and spasm" },
    { code: "R10.84", description: "Abdominal pain, other specified type" },
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
