import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

interface SurveyData {
  Q915?: string;
  [key: string]: any;
}

interface HousingStatusChartProps {
  data: SurveyData[];
  graphId: string;
}

export const HousingStatusChart: React.FC<HousingStatusChartProps> = ({
  data,
  graphId,
}) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Own",
      "2": "Rent",
      "3": "Other",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q915;
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
      text: "Housing Status",
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

  return <BaseGraph option={option} graphId={graphId} />;
};
