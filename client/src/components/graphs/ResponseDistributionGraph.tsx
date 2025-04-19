import React from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../api/survey";

interface ResponseDistributionGraphProps {
  data: SurveyResponse[];
  field: string;
  title: string;
}

export const ResponseDistributionGraph: React.FC<
  ResponseDistributionGraphProps
> = ({ data, field, title }) => {
  // Process data to get distribution
  const distribution = data.reduce((acc, response) => {
    const value = response[field];
    if (value !== undefined && value !== null) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
  }));

  const option: EChartsOption = {
    title: {
      text: title,
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
        radius: "50%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <BaseGraph option={option} />;
};
