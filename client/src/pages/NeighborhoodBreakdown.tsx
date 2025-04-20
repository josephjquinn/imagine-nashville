import React from "react";
import { MobilityGoalsByNeighborhoodChart } from "../components/graphs/MobilityGoalsByNeighborhood";
import { useSurveyData } from "../hooks/useSurveyData";

export const NeighborhoodBreakdown: React.FC = () => {
  const { data, isLoading, error } = useSurveyData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Neighborhood Breakdown</h1>
      <p className="text-gray-600 mb-8">
        Explore how different neighborhoods prioritize mobility goals across
        Nashville.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <MobilityGoalsByNeighborhoodChart
          data={data}
          title="Top Goals of Mobility by Neighborhood"
          subtitle="Percentage of residents who selected each goal as their first priority"
        />
      </div>
    </div>
  );
};
