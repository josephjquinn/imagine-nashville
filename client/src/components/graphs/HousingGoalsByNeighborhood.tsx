import React, { useEffect, useState } from "react";
import { SurveyResponse } from "../../api/survey";
import { BaseTable } from "./base/BaseTable";

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
    const totalResponses: Record<string, number> = {};
    Object.keys(HOUSING_GOALS).forEach((goal) => {
      totalResponses[goal] = 0;
    });

    let totalValidResponses = 0;

    // Count total responses for each goal
    data.forEach((response) => {
      const firstChoice = String(response.Q605);
      if (firstChoice && Object.keys(HOUSING_GOALS).includes(firstChoice)) {
        totalResponses[firstChoice]++;
        totalValidResponses++;
      }
    });

    // Calculate percentages and find top choices
    const percentages: Record<string, string> = {};
    const values: Record<string, number> = {};

    Object.keys(HOUSING_GOALS).forEach((goal) => {
      const percentage = (totalResponses[goal] / totalValidResponses) * 100;
      percentages[goal] = `${Math.round(percentage)}%`;
      values[goal] = percentage;
    });

    // Sort goals by percentage to find top choices
    const sortedGoals = Object.entries(values)
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
            {percentages[goalId]}
          </div>
          <div className="text-sm font-medium text-gray-700 max-w-[200px]">
            {GOAL_LABELS[goalId]}
          </div>
        </div>
      )),
    ];

    // Prepare table rows
    const rows = NEIGHBORHOODS.map((neighborhood) => {
      // Find the code for this neighborhood
      const neighborhoodCode = Object.entries(NEIGHBORHOOD_CODE_MAP).find(
        ([_, name]) => name === neighborhood
      )?.[0];

      if (!neighborhoodCode) return [];

      // Filter data for this neighborhood
      const neighborhoodData = data.filter(
        (response) => response.Area_NEW === neighborhoodCode
      );

      // Count responses for this neighborhood
      const neighborhoodResponses: Record<string, number> = {};
      Object.keys(HOUSING_GOALS).forEach((goal) => {
        neighborhoodResponses[goal] = 0;
      });

      let neighborhoodTotal = 0;

      neighborhoodData.forEach((response) => {
        const firstChoice = String(response.Q605);
        if (firstChoice && Object.keys(HOUSING_GOALS).includes(firstChoice)) {
          neighborhoodResponses[firstChoice]++;
          neighborhoodTotal++;
        }
      });

      // Find top choices for this neighborhood
      const neighborhoodValues: Record<string, number> = {};
      Object.keys(HOUSING_GOALS).forEach((goal) => {
        neighborhoodValues[goal] =
          neighborhoodTotal > 0
            ? (neighborhoodResponses[goal] / neighborhoodTotal) * 100
            : 0;
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
      goalPercentages: percentages,
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
