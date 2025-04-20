import { useState, useEffect } from "react";
import { SurveyResponse, surveyService } from "../api/survey";

export const useSurveyData = () => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await surveyService.getAllSurveyResponses();
        setData(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch survey data"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}; 