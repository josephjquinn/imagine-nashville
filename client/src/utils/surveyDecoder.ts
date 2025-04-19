const QUESTION_MAPPINGS: Record<string, { question: string; answers?: Record<string, string> }> = {
  Q105: {
    question: "Please identify your gender.",
    answers: {
      "1": "Male",
      "2": "Female",
      "3": "Non-binary",
      "4": "Prefer to self-describe"
    }
  },
  Q100: {
    question: "What is your age?",
  },
  ETHNICITY: {
    question: "Ethnicity",
    answers: {
      "1": "White",
      "2": "Black or African American",
      "3": "Hispanic or Latino",
      "4": "Asian",
      "5": "Native American or Alaska Native",
      "6": "Native Hawaiian or Pacific Islander",
      "7": "Other",
      "8": "Prefer not to say"
    }
  },
};

/**
 * Gets the human-readable question text for a field
 * @param field The field name from the survey response
 * @returns The human-readable question text
 */
export function getQuestionText(field: string): string {
  return QUESTION_MAPPINGS[field]?.question || field;
}

/**
 * Gets the human-readable answer text for a field value
 * @param field The field name from the survey response
 * @param value The raw value from the survey response
 * @returns The human-readable answer text
 */
export function getAnswerText(field: string, value: string): string {
  const mapping = QUESTION_MAPPINGS[field];
  if (mapping?.answers && value in mapping.answers) {
    return mapping.answers[value];
  }
  return value;
}

/**
 * Gets all possible answers for a question
 * @param field The field name from the survey response
 * @returns Record of answer codes to human-readable answers
 */
export function getAnswerOptions(field: string): Record<string, string> | undefined {
  return QUESTION_MAPPINGS[field]?.answers;
} 