import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q930?: string;
  [key: string]: any;
}

interface MaritalStatusChartProps {
  data: SurveyData[];
  graphId: string;
}

export const MaritalStatusChart: React.FC<MaritalStatusChartProps> = ({
  data,
  graphId,
}) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Married",
      "2": "Separated",
      "3": "Divorced",
      "4": "Single",
      "5": "Widowed",
      "6": "Engaged",
      "7": "Living Together",
      "8": "Prefer Not to Answer",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q930;
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
      text: "Marital Status",
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

  return (
    <BaseGraph option={option} graphId={graphId} style={{ height: "400px" }} />
  );
};
