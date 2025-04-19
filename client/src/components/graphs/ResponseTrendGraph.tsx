import React from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../api/survey";

interface ResponseTrendGraphProps {
  data: SurveyResponse[];
}

export const ResponseTrendGraph: React.FC<ResponseTrendGraphProps> = ({
  data,
}) => {
  // Process data to get daily counts with null checking
  const dailyCounts = data.reduce((acc, response) => {
    if (response.date) {
      try {
        const date = response.date.split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
      } catch (error) {
        console.warn("Invalid date format:", response.date);
      }
    }
    return acc;
  }, {} as Record<string, number>);

  const dates = Object.keys(dailyCounts).sort();
  const counts = dates.map((date) => dailyCounts[date]);

  // If no valid data, show empty state
  if (dates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid date data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: "Survey Responses Over Time",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c} responses",
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      name: "Number of Responses",
    },
    series: [
      {
        data: counts,
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.3,
        },
        lineStyle: {
          width: 3,
        },
      },
    ],
  };

  return <BaseGraph option={option} />;
};
