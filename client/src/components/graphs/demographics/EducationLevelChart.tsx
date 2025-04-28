import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q935?: string;
  [key: string]: any;
}

interface EducationLevelChartProps {
  data: SurveyData[];
  graphId: string;
}

export const EducationLevelChart: React.FC<EducationLevelChartProps> = ({
  data,
  graphId,
}) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Less than High School",
      "2": "High School/GED",
      "3": "Some College",
      "4": "College Graduate",
      "5": "Post-graduate",
      "6": "Prefer Not to Answer",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q935;
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
      text: "Education Level",
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
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Number of Responses",
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

  return <BaseGraph option={option} graphId={graphId} />;
};
