import { useState, useEffect } from "react";
import { SurveyResponse, FormalSurveyService } from "../api/formal_survey";
import { PublicSurveyService } from "../api/public_survey";
import { MergedSurveyService } from "../api/merged_survey";

export type SurveyType = 'formal' | 'public' | 'merged';

const getSurveyService = (type: SurveyType) => {
  switch (type) {
    case 'formal':
      return FormalSurveyService;
    case 'public':
      return PublicSurveyService;
    case 'merged':
      return MergedSurveyService;
    default:
      throw new Error(`Invalid survey type: ${type}`);
  }
};

export const useSurveyData = (type: SurveyType = 'merged') => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const service = getSurveyService(type);
        const response = await service.getAllSurveyResponses();
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch survey data"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return { data, isLoading, error };
}; 