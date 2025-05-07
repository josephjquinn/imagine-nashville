import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../../api/survey";
import { useIsMobile } from "@/hooks/useIsMobile";

// Rating scale definitions
const RATING_SCALE = {
  1: "Not performing well at all",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "Performing extremely well",
};

// Default priority fields for Nashville performance ratings
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

interface PriorityPerformanceChartProps {
  data: SurveyResponse[];
  priorityFields?: Array<{ field: string; label: string }>;
  graphId: string;
}

export const PriorityPerformanceChart: React.FC<
  PriorityPerformanceChartProps
> = ({ data, priorityFields = DEFAULT_PRIORITY_FIELDS, graphId }) => {
  const isMobile = useIsMobile();
  // Process data to get average ratings for each priority
  const priorityRatings = useMemo(() => {
    return priorityFields
      .map(({ field, label }) => {
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

        // Calculate distribution across scale (1-10)
        const distribution = Array(10).fill(0);
        ratings.forEach((rating) => {
          distribution[rating - 1]++;
        });

        return {
          priority: label,
          averageRating: average,
          count: ratings.length,
          distribution,
        };
      })
      .sort((a, b) => a.averageRating - b.averageRating); // Sort by lowest rating first (highest bars at top)
  }, [data, priorityFields]);

  // If no valid data, show empty state
  if (priorityRatings.every((item) => item.count === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid performance rating data available
        </p>
      </div>
    );
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const dataIndex = params[0].dataIndex;
        const item = priorityRatings[dataIndex];

        let tooltipContent = `<div><strong>${item.priority}</strong><br/>`;
        tooltipContent += `Average Rating: ${item.averageRating}/10<br/>`;
        tooltipContent += `Responses: ${item.count}<br/><br/>`;

        tooltipContent += `<strong>Distribution:</strong><br/>`;
        tooltipContent += '<table style="width: 100%">';
        for (let i = 0; i < 10; i++) {
          const percentage =
            item.count > 0
              ? ((item.distribution[i] / item.count) * 100).toFixed(1)
              : "0.0";
          tooltipContent += `<tr>
            <td>${i + 1}${
            i === 0
              ? ` (${RATING_SCALE[1]})`
              : i === 9
              ? ` (${RATING_SCALE[10]})`
              : ""
          }:</td>
            <td>${item.distribution[i]} (${percentage}%)</td>
          </tr>`;
        }
        tooltipContent += "</table></div>";

        return tooltipContent;
      },
      confine: true,
    },
    grid: {
      left: "45%", // Increase to give more room for labels
      right: "5%",
      bottom: 30,
      top: 65,
      containLabel: false,
    },
    xAxis: {
      type: "value",
      min: 0,
      max: 10,
      splitNumber: 10,
      name: "Average Rating (1-10)",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: "{value}",
      },
    },
    yAxis: {
      type: "category",
      data: priorityRatings.map((item) => item.priority),
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
      axisLabel: {
        overflow: "break", // Enable text wrapping
        lineHeight: 16,
        margin: isMobile ? 300 : 440,
        align: "left",
        fontSize: isMobile ? 10 : 12,
      },
    },
    series: [
      {
        name: "Average Rating",
        type: "bar",
        data: priorityRatings.map((item) => ({
          value: item.averageRating,
          itemStyle: {
            // Color based on rating (red to green gradient)
            color: getColorByRating(item.averageRating),
          },
        })),
        label: {
          show: true,
          position: "right",
          formatter: "{c} / 10",
          fontSize: 12,
          distance: 5,
        },
        barMaxWidth: 25,
        barGap: "30%",
      },
    ],
  };
  return (
    <BaseGraph
      option={option}
      style={{ height: "500px" }}
      graphId={graphId}
      title="Nashville Priority Performance Ratings"
      subtitle="1 = Not performing well at all, 10 = Performing extremely well"
    />
  );
};

// Helper function to generate color based on rating
function getColorByRating(rating: number): string {
  // Performance scale colors (from poor to excellent)
  if (rating <= 2) {
    return "#dc2626"; // Deep red - Very poor
  } else if (rating <= 3) {
    return "#ef4444"; // Red - Poor
  } else if (rating <= 4) {
    return "#f97316"; // Orange - Below average
  } else if (rating <= 5) {
    return "#eab308"; // Yellow - Average
  } else if (rating <= 6) {
    return "#a3e635"; // Light yellow-green - Above average
  } else if (rating <= 7) {
    return "#84cc16"; // Lime - Good
  } else if (rating <= 8) {
    return "#22c55e"; // Green - Very good
  } else if (rating <= 9) {
    return "#16a34a"; // Emerald - Excellent
  } else {
    return "#15803d"; // Forest green - Outstanding
  }
}
