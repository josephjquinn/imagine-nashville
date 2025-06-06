import { useState, useEffect } from "react";
import { SurveyResponse, SurveyType, createSurveyService, FilterOptions } from "../api/survey";
import { DemographicFiltersState } from "../components/filters/DemographicFilters";
import { DISTRICT_DATA } from "../data/districtData";

// Re-export SurveyType for backward compatibility
export type { SurveyType };

/**
 * Maps demographic filter values to their corresponding database query values
 * @param filters The demographic filters to map
 * @returns A record of query parameters for the survey service
 */
const mapFiltersToQuery = (filters: DemographicFiltersState): FilterOptions => {
  const queryFilters: FilterOptions = {};

  // Handle age range filter first
  if (filters.Q100) {
    queryFilters.Q100 = filters.Q100;
  }

  // Handle district filters - support both single district and districts array
  if (filters.district) {
    // Get ZIP codes for the single district
    const districtZips = DISTRICT_DATA[filters.district] || [];
    if (districtZips.length > 0) {
      queryFilters.Q113 = { in: districtZips };
    }
  } else if (filters.districts && filters.districts.length > 0) {
    // Get all ZIP codes for the selected districts
    const allDistrictZips = filters.districts.flatMap(district => DISTRICT_DATA[district] || []);
    if (allDistrictZips.length > 0) {
      queryFilters.Q113 = { in: allDistrictZips };
    }
  }

  if (filters.region && filters.region.length > 0) {
    queryFilters.Region_NEW = { in: filters.region };
  }

  if (filters.area && filters.area.length > 0) {
    queryFilters.Area_NEW = { in: filters.area };
  }

  if (filters.neighborhood && filters.neighborhood.length > 0) {
    queryFilters.Neighborhood_New = { in: filters.neighborhood };
  }

  if (filters.income && filters.income.length > 0) {
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
    queryFilters.Q987 = { in: filters.income.map(income => incomeMap[income]) };
  }

  if (filters.gender && filters.gender.length > 0) {
    const genderMap: Record<string, string> = {
      "male": "1",
      "female": "2",
      "other": "3",
      "prefer-not": "4"
    };
    queryFilters.Q105 = { in: filters.gender.map(gender => genderMap[gender]) };
  }

  if (filters.ethnicity && filters.ethnicity.length > 0) {
    queryFilters.HQ130 = { in: filters.ethnicity };
  }

  if (filters.education && filters.education.length > 0) {
    const educationMap: Record<string, string> = {
      "less-than-high-school": "1",
      "high-school": "2",
      "some-college": "3",
      "college-graduate": "4",
      "post-graduate": "5",
      "prefer-not": "6"
    };
    queryFilters.Q935 = { in: filters.education.map(edu => educationMap[edu]) };
  }

  if (filters.employment && filters.employment.length > 0) {
    const employmentMap: Record<string, string> = {
      "employed": "1",
      "unemployed": "2",
      "retired": "3",
      "student": "4"
    };
    queryFilters.Q940 = { in: filters.employment.map(emp => employmentMap[emp]) };
  }

  if (filters.housing && filters.housing.length > 0) {
    const housingMap: Record<string, string> = {
      "own": "1",
      "rent": "2",
      "other": "3"
    };
    queryFilters.Q915 = { in: filters.housing.map(housing => housingMap[housing]) };
  }

  if (filters.maritalStatus && filters.maritalStatus.length > 0) {
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
    queryFilters.Q930 = { in: filters.maritalStatus.map(status => maritalMap[status]) };
  }

  if (filters.children && filters.children.length > 0) {
    const childrenMap: Record<string, string> = {
      "yes": "2",
      "no": "1"
    };
    queryFilters.Q920 = { in: filters.children.map(children => childrenMap[children]) };
  }

  if (filters.politicalAffiliation && filters.politicalAffiliation.length > 0) {
    const politicalMap: Record<string, string> = {
      "republican": "1",
      "democrat": "2",
      "independent": "3",
      "other": "4",
      "prefer-not": "5"
    };
    queryFilters.Q955 = { in: filters.politicalAffiliation.map(affil => politicalMap[affil]) };
  }

  if (filters.religiousAffiliation && filters.religiousAffiliation.length > 0) {
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
    queryFilters.Q990 = { in: filters.religiousAffiliation.map(affil => religiousMap[affil]) };
  }

  if (filters.sexualOrientation && filters.sexualOrientation.length > 0) {
    const orientationMap: Record<string, string> = {
      "straight": "1",
      "gay": "2",
      "bisexual": "3",
      "other": "4",
      "not-sure": "5",
      "prefer-not": "6"
    };
    queryFilters.Q980 = { in: filters.sexualOrientation.map(orient => orientationMap[orient]) };
  }

  return queryFilters;
};

/**
 * Custom hook for fetching and managing survey data
 * @param type The type of survey to fetch (formal, public, or merged)
 * @param filters Optional demographic filters to apply to the survey data
 * @returns An object containing the survey data, loading state, and any errors
 */
export const useSurveyData = (type: SurveyType = 'merged', filters?: DemographicFiltersState) => {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const service = createSurveyService(type);
        const queryFilters = filters ? mapFiltersToQuery(filters) : {};
        console.log('Query filters being sent to API:', queryFilters);
        const response = await service.getFilteredSurveyResponses(queryFilters);
        setData(response.data);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to fetch survey data");
        console.error('Error fetching survey data:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, filters]);

  return { data, isLoading, error };
}; 