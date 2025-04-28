import React, { useEffect, useState } from "react";
import { SurveyResponse } from "@/types/survey";
import { BaseTable } from "../base/BaseTable";

interface HousingGoalsProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
}

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

// Goals from the survey (Q605/Q610)
const HOUSING_GOALS: Record<string, string> = {
  "1": "Eliminate homelessness",
  "2": "Ensure we are building a variety of housing options in all neighborhoods",
  "3": "Ensure people can afford to stay in their homes",
  "4": "Ensure low-cost housing options are equally available to people of all walks",
  "5": "Make sure there is plenty of affordable housing for people who keep the city going",
};

// Goal abbreviations for display
const GOAL_LABELS: Record<string, string> = {
  "1": "Eliminate homelessness",
  "2": "Housing variety",
  "3": "Housing affordability",
  "4": "Equal access",
  "5": "Essential workers housing",
};

export const HousingGoalsByNeighborhoodChart: React.FC<HousingGoalsProps> = ({
  data,
  title = "Top Goals of Housing by Neighborhood",
  subtitle = "",
}) => {
  const [tableData, setTableData] = useState<{
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
    goalPercentages: Record<string, string>;
    topChoice: string;
    secondChoice: string;
  } | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Initialize data structures for counting responses
    const firstChoiceData: Record<string, Record<string, number>> = {};
    const secondChoiceData: Record<string, Record<string, number>> = {};
    const firstPriorityTotals: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    const secondPriorityTotals: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    let totalFirstPriorityResponses = 0;
    let totalSecondPriorityResponses = 0;

    // Process each neighborhood
    NEIGHBORHOODS.forEach((neighborhood) => {
      firstChoiceData[neighborhood] = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };
      secondChoiceData[neighborhood] = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
      };

      // Find the code for this neighborhood
      const neighborhoodCode = Object.entries(NEIGHBORHOOD_CODE_MAP).find(
        ([_, name]) => name === neighborhood
      )?.[0];

      if (!neighborhoodCode) {
        console.warn(`No code found for neighborhood: ${neighborhood}`);
        return;
      }

      // Filter data for this neighborhood using the code
      const neighborhoodData = data.filter((response) => {
        // Handle potential string/number mismatch in Area_NEW
        const responseArea = String(response.Area_NEW).trim();
        return responseArea === neighborhoodCode;
      });

      // Count responses for this neighborhood
      let neighborhoodFirstPriorityTotal = 0;
      let neighborhoodSecondPriorityTotal = 0;

      neighborhoodData.forEach((response) => {
        // Handle potential string/number mismatch in responses
        const firstPriority = String(response.Q605).trim();
        const secondPriority = String(response.Q610).trim();

        // Validate first priority response
        if (firstPriority && HOUSING_GOALS[firstPriority]) {
          firstChoiceData[neighborhood][firstPriority]++;
          firstPriorityTotals[firstPriority]++;
          neighborhoodFirstPriorityTotal++;
          totalFirstPriorityResponses++;
        }

        // Validate second priority response
        if (secondPriority && HOUSING_GOALS[secondPriority]) {
          secondChoiceData[neighborhood][secondPriority]++;
          secondPriorityTotals[secondPriority]++;
          neighborhoodSecondPriorityTotal++;
          totalSecondPriorityResponses++;
        }
      });

      // Calculate percentages for this neighborhood
      Object.keys(HOUSING_GOALS).forEach((goalId) => {
        const firstPercentage =
          neighborhoodFirstPriorityTotal > 0
            ? (firstChoiceData[neighborhood][goalId] /
                neighborhoodFirstPriorityTotal) *
              100
            : 0;
        const secondPercentage =
          neighborhoodSecondPriorityTotal > 0
            ? (secondChoiceData[neighborhood][goalId] /
                neighborhoodSecondPriorityTotal) *
              100
            : 0;

        firstChoiceData[neighborhood][goalId] = firstPercentage;
        secondChoiceData[neighborhood][goalId] = secondPercentage;
      });
    });

    // Calculate overall percentages
    const firstPriorityPercentages: Record<string, string> = {};
    const secondPriorityPercentages: Record<string, string> = {};
    const goalValues: Record<string, number> = {};

    Object.keys(HOUSING_GOALS).forEach((goalId) => {
      const firstPercentage =
        totalFirstPriorityResponses > 0
          ? (firstPriorityTotals[goalId] / totalFirstPriorityResponses) * 100
          : 0;
      const secondPercentage =
        totalSecondPriorityResponses > 0
          ? (secondPriorityTotals[goalId] / totalSecondPriorityResponses) * 100
          : 0;

      firstPriorityPercentages[goalId] = `${firstPercentage.toFixed(1)}%`;
      secondPriorityPercentages[goalId] = `${secondPercentage.toFixed(1)}%`;
      goalValues[goalId] = firstPercentage;
    });

    // Debug output
    console.log("Data processing summary:", {
      totalResponses: data.length,
      totalFirstPriorityResponses,
      totalSecondPriorityResponses,
      firstPriorityTotals,
      secondPriorityTotals,
      firstPriorityPercentages,
      secondPriorityPercentages,
    });

    // Log sample data for debugging
    if (data.length > 0) {
      console.log("Sample response data:", {
        Area_NEW: data[0].Area_NEW,
        Q605: data[0].Q605,
        Q610: data[0].Q610,
      });
    }

    // Find top two goals based on first priority
    const sortedGoals = Object.entries(goalValues)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => id);

    const topChoice = sortedGoals[0];
    const secondChoice = sortedGoals[1];

    // Prepare table headers
    const headers = [
      <div className="w-[200px]"></div>,
      ...Object.keys(HOUSING_GOALS).map((goalId) => (
        <div key={goalId} className="flex flex-col items-center space-y-2">
          <div className="text-2xl font-bold text-red-600">
            {firstPriorityPercentages[goalId]}
          </div>
          <div className="text-sm font-medium text-gray-700 max-w-[200px]">
            {GOAL_LABELS[goalId]}
          </div>
        </div>
      )),
    ];

    // Prepare table rows
    const rows = NEIGHBORHOODS.map((neighborhood) => {
      // Find top choices for this neighborhood
      const neighborhoodValues: Record<string, number> = {};
      Object.keys(HOUSING_GOALS).forEach((goalId) => {
        neighborhoodValues[goalId] = firstChoiceData[neighborhood][goalId];
      });

      const sortedNeighborhoodGoals = Object.entries(neighborhoodValues)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id);

      const neighborhoodTopChoice = sortedNeighborhoodGoals[0];
      const neighborhoodSecondChoice = sortedNeighborhoodGoals[1];

      return [
        <div className="font-medium text-sm text-gray-700">{neighborhood}</div>,
        ...Object.keys(HOUSING_GOALS).map((goalId) => {
          const isTopChoice = goalId === neighborhoodTopChoice;
          const isSecondChoice = goalId === neighborhoodSecondChoice;

          return (
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
              {!isTopChoice && !isSecondChoice && <div className="w-8 h-8" />}
            </div>
          );
        }),
      ];
    });

    setTableData({
      headers,
      rows,
      goalPercentages: firstPriorityPercentages,
      topChoice,
      secondChoice,
    });
  }, [data]);

  if (!tableData) {
    return <div>Loading chart data...</div>;
  }

  return (
    <BaseTable
      title={title}
      subtitle={subtitle}
      headers={tableData.headers}
      rows={tableData.rows}
      showLegend
      legendItems={[
        {
          label: "1st Choice",
          color: "#dc2626",
          icon: (
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ),
        },
        {
          label: "2nd Choice",
          color: "#9ca3af",
          icon: (
            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ),
        },
      ]}
    />
  );
};
