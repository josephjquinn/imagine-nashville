import React, { useMemo } from "react";
import { BaseGraph } from "./base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q905?: string;
  [key: string]: any;
}

interface LivingAreaChartProps {
  data: SurveyData[];
}

export const LivingAreaChart: React.FC<LivingAreaChartProps> = ({ data }) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Urban/City Area",
      "2": "Suburban Area",
      "3": "Small Town/City",
      "4": "Rural Area",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q905;
      if (category && counts[category] !== undefined) {
        counts[category]++;
      }
    });

    return Object.entries(categories).map(([key, label]) => ({
      name: label,
      value: counts[key],
    }));
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: "Living Area Type",
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
          show: true,
          formatter: "{d}%",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        data: processedData,
      },
    ],
  };

  return <BaseGraph option={option} />;
};
