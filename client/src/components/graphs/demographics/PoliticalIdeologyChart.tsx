import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SurveyData {
  Q975?: string;
  [key: string]: any;
}

interface PoliticalIdeologyChartProps {
  data: SurveyData[];
  graphId: string;
}

export const PoliticalIdeologyChart: React.FC<PoliticalIdeologyChartProps> = ({
  data,
  graphId,
}) => {
  const isMobile = useIsMobile();

  const processedData = useMemo(() => {
    const categories = {
      "1": "Conservative",
      "2": "Moderate",
      "3": "Liberal",
      "4": "Not Sure",
      "5": "Prefer Not to Answer",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q975;
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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: processedData.labels,
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: isMobile ? "" : "Number of Responses",
      nameGap: 20,
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
      left: "8%",
      right: "4%",
      bottom: "15%",
    },
  };

  return (
    <BaseGraph
      option={option}
      graphId={graphId}
      style={{ height: "350px" }}
      title="Political Ideology"
    />
  );
};
