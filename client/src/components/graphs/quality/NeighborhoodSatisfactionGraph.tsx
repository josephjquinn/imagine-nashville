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
  title?: string;
  subtitle?: string;
}

export const NeighborhoodSatisfactionGraph: React.FC<
  NeighborhoodSatisfactionGraphProps
> = ({
  data,
  graphId,
  title = "Neighborhood Satisfaction Rating",
  subtitle = "Distribution of resident ratings on a scale of 1 (least satisfied) to 10 (most satisfied)",
}) => {
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
      top: "20%",
      right: "4%",
      bottom: "5%",
    },
  };

  return (
    <BaseGraph
      option={option}
      graphId={graphId}
      title={title}
      subtitle={subtitle}
    />
  );
};
