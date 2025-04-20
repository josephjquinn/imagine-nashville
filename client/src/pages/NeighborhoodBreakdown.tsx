import React, { useState } from "react";
import { MobilityGoalsByNeighborhoodChart } from "../components/graphs/MobilityGoalsByNeighborhood";
import { HousingGoalsByNeighborhoodChart } from "../components/graphs/HousingGoalsByNeighborhood";
import { MobilityPrioritiesTable } from "../components/graphs/MobilityPrioritiesTable";
import { HousingPrioritiesTable } from "../components/graphs/HousingPrioritiesTable";
import { useSurveyData } from "../hooks/useSurveyData";

type QuestionType = "mobility" | "housing";

export const NeighborhoodBreakdown: React.FC = () => {
  const { data, isLoading, error } = useSurveyData();
  const [selectedType, setSelectedType] = useState<QuestionType>("mobility");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading insights...</p>
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
              className="block w-64 px-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
            >
              <option value="mobility">Mobility Questions</option>
              <option value="housing">Housing Questions</option>
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
                      <MobilityGoalsByNeighborhoodChart
                        data={data}
                        title="Neighborhood Mobility Goals"
                        subtitle="Distribution of primary mobility goals by neighborhood"
                      />
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
                      <HousingGoalsByNeighborhoodChart
                        data={data}
                        title="Neighborhood Housing Goals"
                        subtitle="Distribution of primary housing goals by neighborhood"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Understanding the Data
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  This analysis combines mean priority scores and goal
                  distributions to provide a comprehensive view of{" "}
                  {selectedType === "mobility" ? "mobility" : "housing"}
                  preferences across Nashville's neighborhoods.
                </p>
                <p>
                  The scores (1-10) indicate the importance residents place on
                  each aspect, while the distribution shows which goals are
                  selected as top priorities.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
