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

const SAFE_TEXT_DISALLOWED_SEQUENCES = [
  "&amp",
  "&lt",
  "&gt",
  "&quot",
  "&apos",
  "&#",
  "]]",
];

const SAFE_TEXT_REGEX = /^[a-zA-Z 0-9~`!@#$%^&*()-_+={[}\]|\\;:'",<>.\/\?\n\t\r]+$/;

export const sanitizeEhrText = (text: string): TextSanitizationResult => {
  const explanationList: Explanation[] = [];
  let sanitizedText = text;

  // Check if text exceeds 60,000 characters
  if (text.length > 60000) {
    explanationList.push({
      original: text,
      replacement: "",
      description: "Text exceeds the maximum allowed length of 60,000 characters",
    });
    return {
      sanitizedText: text,
      original: text,
      explanationList,
      hasChanges: true,
    };
  }

  // Check for disallowed sequences
  SAFE_TEXT_DISALLOWED_SEQUENCES.forEach((sequence) => {
    if (text.includes(sequence)) {
      explanationList.push({
        original: sequence,
        replacement: "",
        description: `Remove disallowed sequence '${sequence}'`,
      });
      sanitizedText = sanitizedText.replace(new RegExp(sequence, 'g'), "");
    }
  });

  // Apply existing replacement rules
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

  // Check if text matches SafeText regex
  const isSafeText = SAFE_TEXT_REGEX.test(sanitizedText);
  if (!isSafeText) {
    explanationList.push({
      original: sanitizedText,
      replacement: "",
      description: "Text does not match SafeText pattern",
    });
  }

  return {
    sanitizedText,
    original: text,
    explanationList,
    hasChanges: explanationList.length > 0,
  };
};
