import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q990?: string;
  [key: string]: any;
}

interface ReligiousAffiliationChartProps {
  data: SurveyData[];
  graphId: string;
}

export const ReligiousAffiliationChart: React.FC<
  ReligiousAffiliationChartProps
> = ({ data, graphId }) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Protestant",
      "2": "Catholic",
      "3": "Jewish",
      "4": "Muslim",
      "5": "Hindu",
      "6": "Buddhist",
      "7": "Other",
      "8": "None",
      "9": "Not Sure",
      "10": "Prefer Not to Answer",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q990;
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
      text: "Religious Affiliation",
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
    <BaseGraph option={option} graphId={graphId} style={{ height: "350px" }} />
  );
};
