import { useState, useEffect } from "react";
import { SurveyResponse, FormalSurveyService } from "../api/formal_survey";
import { PublicSurveyService } from "../api/public_survey";
import { MergedSurveyService } from "../api/merged_survey";
import { DemographicFiltersState } from "../components/filters/DemographicFilters";

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

const mapFiltersToQuery = (filters: DemographicFiltersState) => {
  const queryFilters: Record<string, any> = {};

  if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
    queryFilters.Q100 = {
      gte: parseInt(filters.ageMin),
      lte: parseInt(filters.ageMax)
    };
  }

  if (filters.income) {
    const incomeMap: Record<string, string> = {
      "under-15k": "1",
      "15k-25k": "2",
      "25k-50k": "3",
      "50k-100k": "4",
      "100k-150k": "5",
      "150k-200k": "6",
      "200k+": "7",
      "prefer-not": "8"
    };
    queryFilters.Q987 = incomeMap[filters.income];
  }

  if (filters.gender) {
    const genderMap: Record<string, string> = {
      "male": "1",
      "female": "2",
      "other": "3",
      "prefer-not": "4"
    };
    queryFilters.Q105 = genderMap[filters.gender];
  }

  if (filters.education) {
    const educationMap: Record<string, string> = {
      "less-than-high-school": "1",
      "high-school": "2",
      "some-college": "3",
      "college-graduate": "4",
      "post-graduate": "5",
      "prefer-not": "6"
    };
    queryFilters.Q935 = educationMap[filters.education];
  }

  if (filters.employment) {
    const employmentMap: Record<string, string> = {
      "employed": "1",
      "unemployed": "2",
      "retired": "3",
      "student": "4"
    };
    queryFilters.Q940 = employmentMap[filters.employment];
  }

  if (filters.housing) {
    const housingMap: Record<string, string> = {
      "own": "1",
      "rent": "2",
      "other": "3"
    };
    queryFilters.Q915 = housingMap[filters.housing];
  }

  if (filters.maritalStatus) {
    const maritalMap: Record<string, string> = {
      "married": "1",
      "separated": "2",
      "divorced": "3",
      "single": "4",
      "widowed": "5",
      "engaged": "6",
      "living-together": "7",
      "prefer-not": "8"
    };
    queryFilters.Q930 = maritalMap[filters.maritalStatus];
  }

  if (filters.children) {
    const childrenMap: Record<string, string> = {
      "yes": "1",
      "no": "2"
    };
    queryFilters.Q920 = childrenMap[filters.children];
  }

  if (filters.politicalAffiliation) {
    const politicalMap: Record<string, string> = {
      "republican": "1",
      "democrat": "2",
      "independent": "3",
      "other": "4",
      "prefer-not": "5"
    };
    queryFilters.Q955 = politicalMap[filters.politicalAffiliation];
  }

  if (filters.religiousAffiliation) {
    const religiousMap: Record<string, string> = {
      "protestant": "1",
      "catholic": "2",
      "jewish": "3",
      "muslim": "4",
      "hindu": "5",
      "buddhist": "6",
      "other": "7",
      "none": "8",
      "not-sure": "9",
      "prefer-not": "10"
    };
    queryFilters.Q990 = religiousMap[filters.religiousAffiliation];
  }

  if (filters.sexualOrientation) {
    const orientationMap: Record<string, string> = {
      "straight": "1",
      "gay": "2",
      "bisexual": "3",
      "other": "4",
      "not-sure": "5",
      "prefer-not": "6"
    };
    queryFilters.Q980 = orientationMap[filters.sexualOrientation];
  }

  return queryFilters;
};

export const useSurveyData = (type: SurveyType = 'merged', filters?: DemographicFiltersState) => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const service = getSurveyService(type);
        const queryFilters = filters ? mapFiltersToQuery(filters) : {};
        const response = await service.getFilteredSurveyResponses(queryFilters);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch survey data"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, filters]);

  return { data, isLoading, error };
}; 