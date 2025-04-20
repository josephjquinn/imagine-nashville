import React, { useEffect, useState, ReactNode } from "react";
import { SurveyResponse } from "../../api/survey";
import { BaseGraph } from "./base/BaseGraph";
import * as echarts from "echarts";

interface MobilityGoalsProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
}

// Create a wrapper component for BaseGraph that accepts children
const GraphContainer: React.FC<{
  title?: string;
  subtitle?: string;
  children: ReactNode;
}> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {children}
    </div>
  );
};

// Map of neighborhoods we want to display
const NEIGHBORHOODS = [
  "Joelton / Whites Creek",
  "North Nashville / Bordeaux",
  "East Nashville",
  "Madison / Goodlettsville",
  "Donelson / Hermitage / Old Hickory",
  "Antioch / Cane Ridge / Priest Lake",
  "Woodbine / WeHo / Berry Hill",
  "Crieve Hall / Brentioct",
  "Green Hills/Belle Meade/Forest Hills/Oak Hill",
  "Nations / Sylvan / Charlotte Park",
  "Bellevue",
  "Downtown / Biz District",
  "Gulch / Midtown / Belmont / 12South",
];

// Map numeric codes to neighborhood names
const NEIGHBORHOOD_CODE_MAP: Record<string, string> = {
  "1": "Joelton / Whites Creek",
  "2": "North Nashville / Bordeaux",
  "3": "East Nashville",
  "4": "Madison / Goodlettsville",
  "5": "Donelson / Hermitage / Old Hickory",
  "6": "Antioch / Cane Ridge / Priest Lake",
  "7": "Woodbine / WeHo / Berry Hill",
  "8": "Crieve Hall / Brentioct",
  "9": "Green Hills/Belle Meade/Forest Hills/Oak Hill",
  "10": "Nations / Sylvan / Charlotte Park",
  "11": "Bellevue",
  "12": "Downtown / Biz District",
  "13": "Gulch / Midtown / Belmont / 12South",
};

export const MobilityGoalsByNeighborhoodChart: React.FC<MobilityGoalsProps> = ({
  data,
  title = "Top Goals of Mobility by Neighborhood",
  subtitle = "",
}) => {
  const [chartData, setChartData] = useState<{
    neighborhoods: string[];
    firstChoiceData: Record<string, Record<string, number>>;
    secondChoiceData: Record<string, Record<string, number>>;
    goalPercentages: Record<string, string>;
    topChoice: string;
    secondChoice: string;
  } | null>(null);

  // Goals from the survey (Q630/Q635)
  const MOBILITY_GOALS: Record<string, string> = {
    "1": "Make it easier to get around inside the neighborhoods and communities where people live",
    "2": "Make it easier to get around Nashville — to and from downtown and from one place to another in the region",
    "3": "Ensure everyone has good access to downtown / important parts of the region — across Nashville/Davidson Co.",
    "4": "Improve transportation safety and reduce crashes and personal injuries",
  };

  // Goal abbreviations for display
  const GOAL_LABELS: Record<string, string> = {
    "1": "Make it easier to get around inside the neighborhoods",
    "2": "Make it easier to get around Nashville",
    "3": "Ensure everyone has good access to downtown",
    "4": "Improve transportation safety and reduce crashes",
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Initialize data structures
    const firstChoiceData: Record<string, Record<string, number>> = {};
    const secondChoiceData: Record<string, Record<string, number>> = {};
    const neighborhoods: string[] = [];
    const firstPriorityTotals: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
    };
    const secondPriorityTotals: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
    };
    let totalFirstPriorityResponses = 0;
    let totalSecondPriorityResponses = 0;

    // Process each neighborhood
    NEIGHBORHOODS.forEach((neighborhood) => {
      neighborhoods.push(neighborhood);
      firstChoiceData[neighborhood] = { "1": 0, "2": 0, "3": 0, "4": 0 };
      secondChoiceData[neighborhood] = { "1": 0, "2": 0, "3": 0, "4": 0 };

      // Find the code for this neighborhood
      const neighborhoodCode = Object.entries(NEIGHBORHOOD_CODE_MAP).find(
        ([_, name]) => name === neighborhood
      )?.[0];

      if (!neighborhoodCode) {
        return;
      }

      // Filter data for this neighborhood using the code
      const neighborhoodData = data.filter(
        (response) => response.Area_NEW === neighborhoodCode
      );

      // Count responses
      neighborhoodData.forEach((response) => {
        const firstPriority = String(response.Q630);
        const secondPriority = String(response.Q635);

        if (
          firstPriority &&
          Object.keys(MOBILITY_GOALS).includes(firstPriority)
        ) {
          firstChoiceData[neighborhood][firstPriority]++;
          firstPriorityTotals[firstPriority]++;
          totalFirstPriorityResponses++;
        }

        if (
          secondPriority &&
          Object.keys(MOBILITY_GOALS).includes(secondPriority)
        ) {
          secondChoiceData[neighborhood][secondPriority]++;
          secondPriorityTotals[secondPriority]++;
          totalSecondPriorityResponses++;
        }
      });
    });

    // Calculate percentages for first and second priorities separately
    const firstPriorityPercentages: Record<string, string> = {};
    const secondPriorityPercentages: Record<string, string> = {};
    const goalValues: Record<string, number> = {};

    Object.keys(MOBILITY_GOALS).forEach((goalId) => {
      const firstPercentage =
        totalFirstPriorityResponses > 0
          ? (firstPriorityTotals[goalId] / totalFirstPriorityResponses) * 100
          : 0;
      const secondPercentage =
        totalSecondPriorityResponses > 0
          ? (secondPriorityTotals[goalId] / totalSecondPriorityResponses) * 100
          : 0;

      firstPriorityPercentages[goalId] = `${Math.round(firstPercentage)}%`;
      secondPriorityPercentages[goalId] = `${Math.round(secondPercentage)}%`;

      // For determining top choices, we'll use the first priority percentages
      goalValues[goalId] = firstPercentage;
    });

    // Find top two goals based on first priority
    const sortedGoals = Object.entries(goalValues)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => id);

    const topChoice = sortedGoals[0];
    const secondChoice = sortedGoals[1];

    setChartData({
      neighborhoods,
      firstChoiceData,
      secondChoiceData,
      goalPercentages: firstPriorityPercentages,
      topChoice,
      secondChoice,
    });
  }, [data]);

  if (!chartData) {
    return <div>Loading chart data...</div>;
  }

  return (
    <GraphContainer title={title} subtitle={subtitle}>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-200 py-4 w-[200px]"></th>
              {Object.keys(MOBILITY_GOALS).map((goalId) => (
                <th
                  key={goalId}
                  className="text-center border-b-2 border-gray-200 p-4"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-2xl font-bold text-red-600">
                      {chartData.goalPercentages[goalId]}
                    </div>
                    <div className="text-sm font-medium text-gray-700 max-w-[200px]">
                      {GOAL_LABELS[goalId]}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
            <tr>
              <th className="text-left pl-4 py-3"></th>
              <th
                colSpan={4}
                className="text-center border-b-2 border-gray-100 py-3"
              >
                <div className="flex items-center justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      1st Choice
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      2nd Choice
                    </span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {NEIGHBORHOODS.map((neighborhood, idx) => (
              <tr
                key={neighborhood}
                className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="py-3 pl-4 font-medium text-sm text-gray-700">
                  {neighborhood}
                </td>
                {Object.keys(MOBILITY_GOALS).map((goalId) => {
                  const isTopChoice = goalId === chartData.topChoice;
                  const isSecondChoice = goalId === chartData.secondChoice;

                  return (
                    <td key={goalId} className="text-center py-3">
                      <div className="flex justify-center space-x-4">
                        {isTopChoice && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">1</span>
                            </div>
                          </div>
                        )}
                        {isSecondChoice && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">2</span>
                            </div>
                          </div>
                        )}
                        {!isTopChoice && !isSecondChoice && (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs mt-6 text-center text-gray-500">
          *percent selected as 1<sup>st</sup> or 2<sup>nd</sup> choice among the
          4
        </div>
      </div>
    </GraphContainer>
  );
};
