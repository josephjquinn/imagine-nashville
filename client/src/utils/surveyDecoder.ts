import { SurveyResponse } from '../api/survey';

// Question and answer mappings from key.csv
const QUESTION_MAPPINGS: Record<string, { question: string; answers?: Record<string, string> }> = {
  GENDER_GROUP: {
    question: "Gender",
    answers: {
      "1": "Male",
      "2": "Female",
      "3": "Non-binary",
      "4": "Prefer not to say"
    }
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
  Region_NEW: {
    question: "Region"
  },
  Area_NEW: {
    question: "Area"
  },
  Neighborhood_New: {
    question: "Neighborhood"
  },
  Q100: {
    question: "How long have you lived in your current neighborhood?",
    answers: {
      "1": "Less than 1 year",
      "2": "1-5 years",
      "3": "6-10 years",
      "4": "11-20 years",
      "5": "More than 20 years"
    }
  },
  Q105: {
    question: "What type of housing do you live in?",
    answers: {
      "1": "Single-family home",
      "2": "Apartment/Condo",
      "3": "Townhouse",
      "4": "Other"
    }
  }
};

export interface DecodedSurveyResponse extends SurveyResponse {
  decoded: Record<string, {
    question: string;
    answer: string;
    rawValue: string;
  }>;
}

/**
 * Decodes a single survey response into human-readable format
 * @param response The raw survey response
 * @returns Decoded survey response with human-readable questions and answers
 */
export function decodeSurveyResponse(response: SurveyResponse): DecodedSurveyResponse {
  const decoded: Record<string, { question: string; answer: string; rawValue: string }> = {};

  Object.entries(response).forEach(([key, value]) => {
    const mapping = QUESTION_MAPPINGS[key];
    if (mapping) {
      let answer = value;
      
      // If there's an answer mapping, use it
      if (mapping.answers && value in mapping.answers) {
        answer = mapping.answers[value];
      }

      decoded[key] = {
        question: mapping.question,
        answer: answer,
        rawValue: value
      };
    }
  });

  return {
    ...response,
    decoded
  };
}

/**
 * Decodes multiple survey responses
 * @param responses Array of raw survey responses
 * @returns Array of decoded survey responses
 */
export function decodeSurveyResponses(responses: SurveyResponse[]): DecodedSurveyResponse[] {
  return responses.map(decodeSurveyResponse);
}

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