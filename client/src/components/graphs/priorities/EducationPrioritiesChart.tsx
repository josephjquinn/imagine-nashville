import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const EDUCATION_PRIORITIES = [
  {
    field: "Q660_A",
    label:
      "Improve teacher quality through better recruitment, compensation, training, etc.",
  },
  {
    field: "Q660_B",
    label:
      "Increase funding for public education (per pupil spending is way below comparable cities)",
  },
  {
    field: "Q660_C",
    label: "Increase school safety",
  },
  {
    field: "Q660_D",
    label:
      "Focus on failing schools to do whatever is needed to turn them around",
  },
  {
    field: "Q660_E",
    label:
      "Focus on early childhood health and education—without a good start, chances for success go way down",
  },
  {
    field: "Q660_F",
    label:
      "Increase personalized student focus and support to teach kids in ways that best fit their individual needs",
  },
  {
    field: "Q660_G",
    label:
      "Increase the schooling choice and options available to parents to make sure their child gets the best education",
  },
  {
    field: "Q660_H",
    label:
      "Increase access to affordable, high-quality childcare and early childhood education",
  },
  {
    field: "Q660_I",
    label:
      "Focus on modernizing our school facilities and materials—every child deserves a clean and up-to-date place to learn",
  },
];

interface EducationPrioritiesChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const EducationPrioritiesChart: React.FC<
  EducationPrioritiesChartProps
> = ({ data, title, subtitle, graphId }) => {
  const { processedData } = useMemo(() => {
    const results = EDUCATION_PRIORITIES.map((priority) => {
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
      text: title || "Education Priorities",
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
          color: "#6366f1", // indigo-500
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
