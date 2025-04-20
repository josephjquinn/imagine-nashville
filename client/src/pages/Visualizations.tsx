import React from "react";
import { SurveyResponse } from "../api/survey";
import { GenderPieChart } from "../components/graphs/GenderPieChart";
import { EthnicityPieChart } from "../components/graphs/EthnicityPieChart";
import { AgeHistogramChart } from "../components/graphs/AgeHistogramChart";
import { PriorityPerformanceChart } from "../components/graphs/PriorityPerformanceChart";
import { PriorityQuadrantChart } from "../components/graphs/PriorityQuadrantChart";
import { BelongingBarChart } from "../components/graphs/BelongingPieChart";
import { InclusionRatingsChart } from "../components/graphs/InclusionRatingsChart";
import { NegativeImpactsChart } from "../components/graphs/NegativeImpactsChart";
import { GrowthPerceptionChart } from "../components/graphs/GrowthPerceptionChart";
import { MobilityGoalsByNeighborhoodChart } from "../components/graphs/MobilityGoalsByNeighborhood";
import { HousingGoalsByNeighborhoodChart } from "../components/graphs/HousingGoalsByNeighborhood";
import { TransportationPriorityChart } from "../components/graphs/TransportationPriorityChart";
import { useSurveyData } from "../hooks/useSurveyData";

const SurveyDashboard: React.FC = () => {
  const { data: surveyData, isLoading: loading, error } = useSurveyData();
  const [dataCount, setDataCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (surveyData) {
      setDataCount(surveyData.length);
    }
  }, [surveyData]);

  if (loading) {
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg mb-2">{error.message}</p>
          <p className="text-gray-600 text-sm">
            If this issue persists, please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Survey Analytics Dashboard
      </h1>

      <div className="mb-6 text-center text-gray-600">
        Displaying data from {dataCount} survey responses
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <NegativeImpactsChart
            data={surveyData}
            title="Most Significant Negative Impacts on Quality of Life"
            subtitle="What residents dislike most about living and working in Nashville"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <InclusionRatingsChart
            data={surveyData}
            title="Who is Outside Looking In?"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <PriorityQuadrantChart
            data={surveyData}
            title="Top Learnings...And Biggest Issues Going Unaddressed"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <PriorityPerformanceChart
            data={surveyData}
            title="Nashville Priority Performance Ratings (1-10 Scale)"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <HousingGoalsByNeighborhoodChart
            data={surveyData}
            title="Housing Goals by Neighborhood"
            subtitle="Distribution of primary housing goals by neighborhood"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AgeHistogramChart data={surveyData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <BelongingBarChart data={surveyData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <GenderPieChart data={surveyData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <EthnicityPieChart data={surveyData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <GrowthPerceptionChart data={surveyData} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <TransportationPriorityChart data={surveyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDashboard;
