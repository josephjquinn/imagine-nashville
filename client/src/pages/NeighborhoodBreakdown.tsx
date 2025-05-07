import React, { useState } from "react";
import { MobilityGoalsByNeighborhoodChart } from "../components/graphs/neighborhood/MobilityGoalsByNeighborhood";
import { HousingGoalsByNeighborhoodChart } from "../components/graphs/neighborhood/HousingGoalsByNeighborhood";
import { HousingPrioritiesTable } from "../components/graphs/neighborhood/HousingPrioritiesTable";
import { useSurveyData, SurveyType } from "../hooks/useSurveyData";
import { EducationGoalsByNeighborhoodChart } from "../components/graphs/neighborhood/EducationGoalsByNeighborhoodChart";
import { EducationPrioritiesTable } from "../components/graphs/neighborhood/EducationPrioritiesTable";
import { MobilityPrioritiesTable } from "@/components/graphs/neighborhood/MobilityPrioritiesTable";
import {
  DemographicFilters,
  DemographicFiltersState,
} from "@/components/filters/DemographicFilters";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type QuestionType = "mobility" | "housing" | "education";

type FilterKey = keyof DemographicFiltersState;

export const NeighborhoodBreakdown: React.FC = () => {
  const [selectedType, setSelectedType] = useState<QuestionType>("mobility");
  const [surveyType, setSurveyType] = useState<SurveyType>("formal");
  const [filters, setFilters] = useState<DemographicFiltersState>({});
  const { data, isLoading, error } = useSurveyData(surveyType, filters);

  const handleFilterChange = (newFilters: DemographicFiltersState) => {
    setFilters(newFilters);
  };

  const removeFilter = (key: FilterKey) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const getFilterLabel = (key: FilterKey, value: string) => {
    const labels: Record<FilterKey, string> = {
      ageMin: "Age Min",
      ageMax: "Age Max",
      income: "Income",
      gender: "Gender",
      ethnicity: "Ethnicity",
      education: "Education",
      employment: "Employment",
      housing: "Housing",
      maritalStatus: "Marital Status",
      children: "Children",
      politicalAffiliation: "Political Affiliation",
      religiousAffiliation: "Religious Affiliation",
      sexualOrientation: "Sexual Orientation",
      district: "District",
      region: "Region",
      area: "Area",
      neighborhood: "Neighborhood",
      districts: "Districts",
    };
    return `${labels[key]}: ${value}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Data
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">
            Please try refreshing the page. If the issue persists, contact
            support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95%] mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Nashville Neighborhood Insights
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6">
            Discover how priorities and goals vary across Nashville's diverse
            neighborhoods
          </p>
        </div>

        <div className="py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Filter Results
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as QuestionType)
                }
                className="block w-full sm:w-64 px-4 py-2 sm:py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 cursor-pointer"
              >
                <option value="mobility">Mobility Questions</option>
                <option value="housing">Housing Questions</option>
                <option value="education">Education Questions</option>
              </select>
              <DemographicFilters
                onFilterChange={handleFilterChange}
                totalResponses={data.length}
                surveyType={surveyType}
                onSurveyTypeChange={setSurveyType}
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {Object.entries(filters).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="gap-1">
                {getFilterLabel(key as FilterKey, value as string)}
                <button
                  onClick={() => removeFilter(key as FilterKey)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-4 sm:space-y-8 mt-4 sm:mt-8">
          {selectedType === "mobility" ? (
            <>
              <section>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          Mobility Priorities by Neighborhood
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                          Mean scores across different areas of Nashville
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-600">
                          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
                          Highest scoring regions
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <MobilityPrioritiesTable data={data} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Mobility Goals Distribution
                        </h2>
                        <p className="text-gray-600">
                          First priority selections across neighborhoods
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          Priority distribution
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <MobilityGoalsByNeighborhoodChart data={data} />
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : selectedType === "housing" ? (
            <>
              <section>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Housing Priorities by Neighborhood
                        </h2>
                        <p className="text-gray-600">
                          Mean scores across different areas of Nashville
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Highest scoring regions
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <HousingPrioritiesTable data={data} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Housing Goals Distribution
                        </h2>
                        <p className="text-gray-600">
                          First priority selections across neighborhoods
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          Priority distribution
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <HousingGoalsByNeighborhoodChart data={data} />
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Education Priorities by Neighborhood
                        </h2>
                        <p className="text-gray-600">
                          Mean scores across different areas of Nashville
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          Highest scoring regions
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <EducationPrioritiesTable data={data} />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Education Goals Distribution
                        </h2>
                        <p className="text-gray-600">
                          First priority selections across neighborhoods
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          Priority distribution
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <EducationGoalsByNeighborhoodChart data={data} />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
