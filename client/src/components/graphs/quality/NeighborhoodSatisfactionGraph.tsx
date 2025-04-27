import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q700?: string;
  [key: string]: any;
}

interface NeighborhoodSatisfactionGraphProps {
  data: SurveyData[];
  graphId: string;
}

export const NeighborhoodSatisfactionGraph: React.FC<
  NeighborhoodSatisfactionGraphProps
> = ({ data, graphId }) => {
  const processedData = useMemo(() => {
    // Initialize counts for all possible ratings (1-10)
    const ratingCounts: { [key: number]: number } = {};
    for (let i = 1; i <= 10; i++) {
      ratingCounts[i] = 0;
    }

    // Count occurrences of each rating
    data.forEach((item) => {
      const rating = parseInt(item.Q700 || "0");
      if (rating >= 1 && rating <= 10) {
        ratingCounts[rating]++;
      }
    });

    // Convert to array format
    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }));
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: "Neighborhood Satisfaction Rating",
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
      data: processedData.map((item) => item.rating),
      name: "Rating (1-10)",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Number of Responses",
    },
    series: [
      {
        name: "Responses",
        type: "bar",
        data: processedData.map((item) => item.count),
        itemStyle: {
          color: "#4f46e5", // Indigo color
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
      bottom: "3%",
    },
  };

  return <BaseGraph option={option} graphId={graphId} />;
};
