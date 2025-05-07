import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q920?: string;
  [key: string]: any;
}

interface ChildrenInHouseholdChartProps {
  data: SurveyData[];
  graphId: string;
}

export const ChildrenInHouseholdChart: React.FC<
  ChildrenInHouseholdChartProps
> = ({ data, graphId }) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "No Children",
      "2": "Has Children",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q920;
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
      text: "Children in Household",
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
