import React from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../api/survey";
import { getQuestionText, getAnswerText } from "../../utils/surveyDecoder";

interface RegionPieChartProps {
  data: SurveyResponse[];
  title?: string;
}

export const RegionPieChart: React.FC<RegionPieChartProps> = ({
  data,
  title,
}) => {
  const field = "Region_NEW";

  // Process data to get distribution with null checking
  const distribution = data.reduce((acc, response) => {
    const value = response[field];
    if (value !== undefined && value !== null && value !== "") {
      const decodedValue = getAnswerText(field, String(value));
      acc[decodedValue] = (acc[decodedValue] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(distribution)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  // If no valid data, show empty state
  if (pieData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid data available for Regional Distribution
        </p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: title || "Regional Distribution",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      type: "scroll",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: pieData,
      },
    ],
  };

  return <BaseGraph option={option} />;
};
