import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const HOUSING_PRIORITIES = [
  {
    field: "Q610_A",
    label:
      "Build more homes to increase the housing supply which will bring down housing prices and help meet demand",
  },
  {
    field: "Q610_B",
    label:
      "Provide more buyer/renter assistance and support to get people into housing and help them stay there",
  },
  {
    field: "Q610_C",
    label:
      "Build more compact and less expensive housing closer to where people live, work, and play",
  },
  {
    field: "Q610_D",
    label:
      "Create more community partnerships and programs making more housing more affordable for more people",
  },
  {
    field: "Q610_E",
    label:
      "Increase affordable housing requirements and incentives for developers to make sure they generate more affordable housing options",
  },
];

interface HousingPrioritiesChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const HousingPrioritiesChart: React.FC<HousingPrioritiesChartProps> = ({
  data,
  title,
  subtitle,
  graphId,
}) => {
  const { processedData, totalResponses } = useMemo(() => {
    const results = HOUSING_PRIORITIES.map((priority) => {
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

    // Sort by average rating ascending (highest at top)
    return {
      processedData: results.sort((a, b) => a.average - b.average),
      totalResponses: data.length,
    };
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: title || "Housing Priorities",
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
          color: "#059669", // emerald-600
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
    <BaseGraph option={option} style={{ height: "400px" }} graphId={graphId} />
  );
};
