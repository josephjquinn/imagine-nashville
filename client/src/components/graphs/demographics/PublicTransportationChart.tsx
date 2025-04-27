import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q918?: string;
  [key: string]: any;
}

interface PublicTransportationChartProps {
  data: SurveyData[];
  graphId: string;
}

export const PublicTransportationChart: React.FC<
  PublicTransportationChartProps
> = ({ data, graphId }) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Don't Use",
      "2": "Few Times/Year",
      "3": "Once/Month",
      "4": "Once/Week+",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q918;
      if (category && counts[category] !== undefined) {
        counts[category]++;
      }
    });

    return {
      labels: Object.values(categories),
      values: Object.keys(categories).map((key) => counts[key]),
    };
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: "Public Transportation Usage",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: processedData.labels,
      name: "Usage Frequency",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Number of Responses",
    },
    series: [
      {
        type: "bar",
        data: processedData.values,
        itemStyle: {
          color: "#4f46e5",
        },
        label: {
          show: true,
          position: "top",
        },
      },
    ],
    grid: {
      containLabel: true,
      left: "3%",
      right: "4%",
      bottom: "15%",
    },
  };

  return <BaseGraph option={option} graphId={graphId} />;
};
