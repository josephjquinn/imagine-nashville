import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const TRANSPORTATION_PRIORITIES = [
  {
    field: "Q640_A",
    label: "Reduce traffic congestion",
  },
  {
    field: "Q640_B",
    label:
      "Improve and increase public transportation availability and options throughout the city (light rail, bus rapid transit, expanded bus service)",
  },
  {
    field: "Q640_C",
    label:
      "Improve bicycle and pedestrian connectivity and infrastructure across the city and in the surrounding communities (bikeable streets, sidewalks, greenway and trail networks, etc.)",
  },
  {
    field: "Q640_D",
    label:
      "Construct new street and highway improvements to better connect parts of the city",
  },
  {
    field: "Q640_E",
    label: "Improve road maintenance and operations on existing roads",
  },
  {
    field: "Q640_F",
    label:
      "Promote flexible and remote work schedules to reduce the need and impact of commuting",
  },
];

interface TransportationPrioritiesChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const TransportationPrioritiesChart: React.FC<
  TransportationPrioritiesChartProps
> = ({ data, title, subtitle, graphId }) => {
  const { processedData } = useMemo(() => {
    const results = TRANSPORTATION_PRIORITIES.map((priority) => {
      let sum = 0;
      let count = 0;
      let ratingCounts = new Array(10).fill(0);

      data.forEach((response) => {
        const rating = parseInt(response[priority.field] || "0");
        if (rating >= 1 && rating <= 10) {
          sum += rating;
          count++;
          ratingCounts[rating - 1]++;
        }
      });

      return {
        name: priority.label,
        average: count > 0 ? sum / count : 0,
        totalRatings: count,
        ratingCounts: ratingCounts,
        ratingPercentages: ratingCounts.map((c) =>
          count > 0 ? (c / count) * 100 : 0
        ),
      };
    });

    // Sort by average rating descending
    return {
      processedData: results.sort((a, b) => b.average - a.average),
      totalResponses: data.length,
    };
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: title || "Transportation Priorities",
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      subtext: subtitle || "Average Rating (1-10 Scale)",
      subtextStyle: {
        fontSize: 14,
        color: "#666",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const data = params[0].data;
        return `
          <div style="max-width: 300px; white-space: normal; word-wrap: break-word;">
            <div style="font-weight: bold; margin-bottom: 8px;">${
              data.name
            }</div>
            <div style="margin: 4px 0;">Average Rating: ${data.average.toFixed(
              1
            )}</div>
            <div style="margin: 4px 0;">Total Ratings: ${
              data.totalRatings
            }</div>
            <div style="margin: 4px 0;">Rating Distribution:</div>
            ${data.ratingCounts
              .map(
                (count: number, index: number) =>
                  `<div style="margin: 2px 0;">${
                    index + 1
                  }: ${count} (${data.ratingPercentages[index].toFixed(
                    1
                  )}%)</div>`
              )
              .join("")}
          </div>
        `;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Average Rating",
      min: 1,
      max: 10,
      axisLabel: {
        formatter: "{value}",
      },
    },
    yAxis: {
      type: "category",
      data: processedData.map((item) => item.name),
      axisLabel: {
        width: 300,
        overflow: "break",
        interval: 0,
        align: "right",
      },
    },
    series: [
      {
        name: "Average Rating",
        type: "bar",
        barMaxWidth: 40,
        itemStyle: {
          color: "#3b82f6", // blue-500
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: "right",
          formatter: function (params: any) {
            return params.data.average.toFixed(1);
          },
          color: "#666",
          distance: 5,
        },
        data: processedData.map((item) => ({
          value: item.average,
          name: item.name,
          totalRatings: item.totalRatings,
          ratingCounts: item.ratingCounts,
          ratingPercentages: item.ratingPercentages,
          average: item.average,
        })),
      },
    ],
  };

  return (
    <BaseGraph option={option} style={{ height: "500px" }} graphId={graphId} />
  );
};
