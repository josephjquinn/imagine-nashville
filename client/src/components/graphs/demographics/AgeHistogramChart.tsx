import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AgeHistogramChartProps {
  data: SurveyResponse[];
  title?: string;
  graphId: string;
}

// Age range definitions
const AGE_RANGES = [
  { min: 0, max: 17, label: "Under 18" },
  { min: 18, max: 24, label: "18-24" },
  { min: 25, max: 34, label: "25-34" },
  { min: 35, max: 44, label: "35-44" },
  { min: 45, max: 54, label: "45-54" },
  { min: 55, max: 64, label: "55-64" },
  { min: 65, max: 74, label: "65-74" },
  { min: 75, max: Infinity, label: "75+" },
];

export const AgeHistogramChart: React.FC<AgeHistogramChartProps> = ({
  data,
  title,
  graphId,
}) => {
  const isMobile = useIsMobile();
  const field = "Q100";

  // Process data to get age distribution
  const ageDistribution = useMemo(() => {
    // Initialize distribution with all age ranges set to 0
    const distribution = AGE_RANGES.reduce((acc, range) => {
      acc[range.label] = 0;
      return acc;
    }, {} as Record<string, number>);

    // Count survey responses by age range
    data.forEach((response) => {
      const ageValue = response[field];
      if (ageValue !== undefined && ageValue !== null && ageValue !== "") {
        // Try to parse the age as a number
        const age = parseInt(String(ageValue), 10);
        if (!isNaN(age)) {
          // Find the appropriate age range
          const range = AGE_RANGES.find((r) => age >= r.min && age <= r.max);
          if (range) {
            distribution[range.label]++;
          }
        }
      }
    });

    return distribution;
  }, [data]);

  // Convert distribution to chart data format
  const chartData = Object.entries(ageDistribution).map(
    ([ageRange, count]) => ({
      name: ageRange,
      value: count,
    })
  );

  // If no valid data, show empty state
  if (chartData.every((item) => item.value === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid age data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c} respondents",
    },
    xAxis: {
      type: "category",
      data: AGE_RANGES.map((range) => range.label),
      name: "Age Range",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: isMobile ? "" : "Number of Respondents",
    },
    series: [
      {
        type: "bar",
        data: AGE_RANGES.map(
          (range) =>
            chartData.find((item) => item.name === range.label)?.value || 0
        ),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#83bff6" },
              { offset: 1, color: "#188df0" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      graphId={graphId}
      style={{ height: "400px" }}
      title={title || "Age Distribution"}
    />
  );
};
