import React, { useMemo } from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../api/survey";

// Default priority fields for Nashville performance ratings - same as PriorityPerformanceChart
const DEFAULT_PRIORITY_FIELDS = [
  { field: "Q260_A", label: "A welcoming, accepting place" },
  { field: "Q260_B", label: "Strong sense of community" },
  { field: "Q260_C", label: "Lots of jobs/economic opportunity" },
  { field: "Q260_D", label: "High quality of K-12 education" },
  {
    field: "Q260_E",
    label: "Accessible and high-quality colleges and universities",
  },
  {
    field: "Q260_F",
    label: "Good outdoor recreation, parks, and green spaces",
  },
  { field: "Q260_G", label: "Safe neighborhoods/low crime" },
  { field: "Q260_H", label: "Good restaurants, shopping, and entertainment" },
  { field: "Q260_I", label: "Plenty of good and affordable housing options" },
  { field: "Q260_J", label: "Rich diversity of people and cultures" },
  { field: "Q260_K", label: "High quality healthcare and hospitals" },
  {
    field: "Q260_L",
    label:
      "Easy to get around: good public transportation and no traffic congestion",
  },
  { field: "Q260_M", label: "Taking care of the homeless and less fortunate" },
  {
    field: "Q260_N",
    label: "A gathering place for music, artists, and creative talent",
  },
  {
    field: "Q260_O",
    label:
      "A vibrant downtown, Music City events, special events and activities",
  },
  {
    field: "Q260_P",
    label: "Walkability (access to good sidewalks, crosswalks, trails)",
  },
];

// Impact importance weights (mock data - normally would come from survey)
// Higher number = more impact on resident life
const PRIORITY_IMPACT = {
  Q260_A: 25, // Welcoming
  Q260_B: 20, // Community
  Q260_C: 35, // Jobs
  Q260_D: 30, // K-12 Education
  Q260_E: 25, // Colleges
  Q260_F: 25, // Outdoor rec
  Q260_G: 40, // Safety
  Q260_H: 20, // Restaurants/shopping
  Q260_I: 45, // Housing
  Q260_J: 22, // Diversity
  Q260_K: 30, // Healthcare
  Q260_L: 42, // Transportation
  Q260_M: 38, // Homeless
  Q260_N: 18, // Music/arts
  Q260_O: 22, // Downtown
  Q260_P: 25, // Walkability
};

interface PriorityQuadrantChartProps {
  data: SurveyResponse[];
  title?: string;
  priorityFields?: Array<{ field: string; label: string }>;
  subtitle?: string;
}

export const PriorityQuadrantChart: React.FC<PriorityQuadrantChartProps> = ({
  data,
  title,
  priorityFields = DEFAULT_PRIORITY_FIELDS,
  subtitle,
}) => {
  // Process data to get average ratings for each priority
  const priorityData = useMemo(() => {
    return priorityFields.map(({ field, label }) => {
      // Get all valid ratings for this priority
      const ratings = data
        .map((response) => {
          const value = response[field];
          if (value !== undefined && value !== null && value !== "") {
            const rating = parseInt(String(value), 10);
            return !isNaN(rating) && rating >= 1 && rating <= 10
              ? rating
              : null;
          }
          return null;
        })
        .filter((rating): rating is number => rating !== null);

      // Calculate average rating
      const average =
        ratings.length > 0
          ? parseFloat(
              (
                ratings.reduce((sum, rating) => sum + rating, 0) /
                ratings.length
              ).toFixed(1)
            )
          : 0;

      // Get the impact weight from our mapping
      const impact =
        PRIORITY_IMPACT[field as keyof typeof PRIORITY_IMPACT] || 20;

      // Calculate relative performance (how much better/worse than average)
      // This will be our Y axis value
      const allRatings = priorityFields.flatMap(({ field }) => {
        return data
          .map((response) => {
            const value = response[field];
            if (value !== undefined && value !== null && value !== "") {
              const rating = parseInt(String(value), 10);
              return !isNaN(rating) && rating >= 1 && rating <= 10
                ? rating
                : null;
            }
            return null;
          })
          .filter((rating): rating is number => rating !== null);
      });

      const overallAverage =
        allRatings.length > 0
          ? allRatings.reduce((sum, rating) => sum + rating, 0) /
            allRatings.length
          : 0;

      // Calculate percent difference from average
      const performanceRelative =
        ((average - overallAverage) / overallAverage) * 100;

      return {
        name: label,
        field,
        rating: average,
        impact,
        performanceRelative,
        count: ratings.length,
      };
    });
  }, [data, priorityFields]);

  // If no valid data, show empty state
  if (priorityData.every((item) => item.count === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid priority data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: title || "Top Learnings...And Biggest Issues Going Unaddressed",
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      subtext: subtitle,
      subtextStyle: {
        fontSize: 14,
        color: "#666",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const data = params.data;
        return `
          <div style="font-weight:bold;margin-bottom:5px">${data.name}</div>
          <div>Performance: ${data.rating.toFixed(1)} / 10</div>
          <div>Performance vs. Average: ${data.performanceRelative.toFixed(
            1
          )}%</div>
        `;
      },
    },
    grid: {
      left: 100,
      right: 100,
      top: 100,
      bottom: 100,
    },
    xAxis: {
      type: "value",
      name: "Performance Rating",
      nameLocation: "middle",
      nameGap: 40,
      min: 4,
      max: 8.5,
      axisLabel: {
        formatter: "{value}",
      },
      splitLine: {
        show: true,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      type: "value",
      name: "MAKES LIFE BETTER/WORSE",
      nameLocation: "middle",
      nameGap: 70,
      nameRotate: 90,
      min: -60,
      max: 40,
      axisLabel: {
        formatter: "{value}%",
      },
      splitLine: {
        show: true,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    },
    visualMap: [
      {
        show: false,
        dimension: 2, // The third dimension, which is impact
        min: 15,
        max: 45,
        calculable: true,
        precision: 0.1,
        inRange: {
          symbolSize: [10, 50],
        },
      },
    ],
    series: [
      {
        name: "Priorities",
        type: "scatter",
        data: priorityData.map((item) => ({
          name: item.name,
          value: [item.rating, item.performanceRelative, item.impact],
          rating: item.rating,
          performanceRelative: item.performanceRelative,
          itemStyle: {
            color: getQuadrantColor(item.rating, item.performanceRelative),
          },
        })),
        markLine: {
          silent: true,
          lineStyle: {
            color: "#333",
            type: "solid",
            width: 2,
          },
          data: [
            {
              xAxis: 7,
            },
            {
              yAxis: 0,
            },
          ],
          label: {
            show: false,
          },
        },
        markArea: {
          silent: true,
          itemStyle: {
            opacity: 0.2,
          },
          data: [
            [
              {
                name: "CRITICAL THINGS\nWE ARE FAILING",
                itemStyle: {
                  color: "#fdba74", // orange-300
                },
                xAxis: 4,
                yAxis: -60,
              },
              {
                xAxis: 7,
                yAxis: 0,
              },
            ],
            [
              {
                name: "MAKES WORSE\nDOING BAD",
                itemStyle: {
                  color: "#e5e7eb", // gray-200
                },
                xAxis: 4,
                yAxis: 0,
              },
              {
                xAxis: 7,
                yAxis: 40,
              },
            ],
            [
              {
                name: "GREAT THINGS\nWE DO WELL",
                itemStyle: {
                  color: "#c7d2fe", // indigo-200
                },
                xAxis: 7,
                yAxis: 0,
              },
              {
                xAxis: 8.5,
                yAxis: 40,
              },
            ],
            [
              {
                name: "DOING GOOD",
                itemStyle: {
                  color: "#e5e7eb", // gray-200
                },
                xAxis: 7,
                yAxis: -60,
              },
              {
                xAxis: 8.5,
                yAxis: 0,
              },
            ],
          ],
          label: {
            show: true,
            color: "#333",
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        label: {
          show: false,
          position: "top",
          formatter: function (params) {
            return params.name;
          },
          fontSize: 12,
          color: "#333",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: [3, 5],
          borderRadius: 3,
          lineHeight: 16,
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 14,
          },
        },
      },
    ],
    graphic: [
      {
        type: "text",
        right: 50,
        top: "middle",
        style: {
          text: "Size of dot represents\nsize of impact on\nresidents",
          align: "center",
          fill: "#0891b2",
          fontSize: 14,
        },
      },
    ],
  };

  return <BaseGraph option={option} style={{ height: "700px" }} />;
};

// Helper function to determine color based on which quadrant the point is in
function getQuadrantColor(rating: number, performanceRelative: number): string {
  // Critical things we are failing (lower left)
  if (rating < 7 && performanceRelative < 0) {
    return "#ef4444"; // red
  }
  // Makes worse, doing bad (upper left)
  else if (rating < 7 && performanceRelative >= 0) {
    return "#8b5cf6"; // purple
  }
  // Great things we do well (upper right)
  else if (rating >= 7 && performanceRelative >= 0) {
    return "#f59e0b"; // amber
  }
  // Doing good (lower right)
  else {
    return "#3b82f6"; // blue
  }
}
