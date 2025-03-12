interface ReplacementRules {
  pattern: RegExp;
  replacement: string;
  description: string;
}

interface Explanation {
  original: string;
  replacement: string;
  description: string;
}

export interface TextSanitizationResult {
  sanitizedText: string;
  original: string;
  hasChanges: boolean;
  explanationList: Explanation[];
}

const EHR_CHARACTER_REPLACEMENT_RULES: ReplacementRules[] = [
  {
    pattern: /↓(?=\w)/g,  // Down arrow followed by word character
    replacement: "Decreased ",  // Add space after
    description: "Replace down arrow with 'Decreased'",
  },
  {
    pattern: /µ(?=\w)/g,  // Micro symbol followed by word character
    replacement: "micro ",  // Add space after
    description: "Replace micro symbol with 'micro'",
  },
  {
    pattern: /²/g,
    replacement: " squared",
    description: "Replace superscript 2 with 'squared'",
  },
  {
    pattern: /°/g,
    replacement: " degrees",
    description: "Replace degree symbol with 'degrees'",
  },
];

export const sanitizeEhrText = (text: string): TextSanitizationResult => {
  const explanationList: Explanation[] = [];
  let sanitizedText = text;

  EHR_CHARACTER_REPLACEMENT_RULES.forEach((rule) => {
    const { pattern, replacement, description } = rule;
    const matches = text.match(pattern);

    if (matches) {
      matches.forEach((match) => {
        const explanation = {
          original: match,
          replacement,
          description,
        };
        explanationList.push(explanation);
      });

      sanitizedText = sanitizedText.replace(pattern, replacement);
    }
  });

  return {
    sanitizedText,
    original: text,
    explanationList,
    hasChanges: explanationList.length > 0,
  };
};
