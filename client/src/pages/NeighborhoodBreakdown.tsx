import React, { useState } from "react";
import { MobilityGoalsByNeighborhoodChart } from "../components/graphs/MobilityGoalsByNeighborhood";
import { HousingGoalsByNeighborhoodChart } from "../components/graphs/HousingGoalsByNeighborhood";
import { MobilityPrioritiesTable } from "../components/graphs/MobilityPrioritiesTable";
import { HousingPrioritiesTable } from "../components/graphs/HousingPrioritiesTable";
import { useSurveyData } from "../hooks/useSurveyData";
import { EducationGoalsByNeighborhoodChart } from "../components/graphs/EducationGoalsByNeighborhoodChart";
import { EducationPrioritiesTable } from "../components/graphs/EducationPrioritiesTable";

type QuestionType = "mobility" | "housing" | "education";

export const NeighborhoodBreakdown: React.FC = () => {
  const { data, isLoading, error } = useSurveyData();
  const [selectedType, setSelectedType] = useState<QuestionType>("mobility");

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
      <div className="max-w-[95%] mx-auto px-2 sm:px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Nashville Neighborhood Insights
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Discover how priorities and goals vary across Nashville's diverse
            neighborhoods
          </p>

          <div className="flex justify-center mb-8">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as QuestionType)}
              className="block w-64 px-4 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 cursor-pointer"
            >
              <option value="mobility">Mobility Questions</option>
              <option value="housing">Housing Questions</option>
              <option value="education">Education Questions</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {selectedType === "mobility" ? (
            <>
              <section>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Mobility Priorities by Neighborhood
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
