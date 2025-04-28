import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

// Fields from the image provided (Q405)
const Q405_FIELDS = [
  { field: "Q405_1", label: "High cost of living" },
  { field: "Q405_2", label: "Lack of affordable housing/rent" },
  { field: "Q405_3", label: "Poor quality of K-12 education" },
  { field: "Q405_4", label: "Traffic congestion/Hard to drive" },
  { field: "Q405_5", label: "Lack of public transportation" },
  { field: "Q405_6", label: "Increased crime/public safety" },
  { field: "Q405_7", label: "Homelessness" },
  { field: "Q405_8", label: "Few/low paying jobs/economic inequality" },
  { field: "Q405_9", label: "Too much growth/Not being managed well" },
  { field: "Q405_10", label: "Increased housing/renting costs" },
  { field: "Q405_11", label: "Lack of opportunities for young people" },
  { field: "Q405_12", label: "Lack of community engagement" },
  { field: "Q405_13", label: "Walkability (lack of or issues)" },
];

// Mapping for Q408 (greatest negative impact personally)
// The answer options in Q408 correspond to the selections from Q405
const Q408_MAPPING = {
  "1": "Q405_1", // High cost of living
  "2": "Q405_2", // Lack of affordable housing
  "3": "Q405_3", // Poor quality of K-12 education
  "4": "Q405_4", // Traffic congestion
  "5": "Q405_5", // Lack of public transportation
  "6": "Q405_6", // Increased crime
  "7": "Q405_7", // Homelessness
  "8": "Q405_8", // Few/low paying jobs
  "9": "Q405_9", // Too much growth
  "10": "Q405_10", // Increased housing costs
  "11": "Q405_11", // Lack of opportunities for young people
  "12": "Q405_12", // Lack of community
  "13": "Q405_13", // Walkability issues
};

interface NegativeImpactsChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const NegativeImpactsChart: React.FC<NegativeImpactsChartProps> = ({
  data,
  title,
  subtitle,
  graphId,
}) => {
  // Process data to count mentions of each negative impact
  const negativeImpactsData = useMemo(() => {
    // Count the overall responses for each category (Q405)
    const categoryCounts = Q405_FIELDS.map((category) => {
      let count = 0;
      let greatestImpactCount = 0;

      data.forEach((response) => {
        // Count overall mentions (Q405)
        const value = response[category.field];
        if (value && value !== "" && value !== "0") {
          count++;
        }

        // Count greatest personal impact mentions (Q408)
        const greatestImpact = response["Q408"];
        if (greatestImpact) {
          const mappedField =
            Q408_MAPPING[greatestImpact as keyof typeof Q408_MAPPING];
          if (mappedField === category.field) {
            greatestImpactCount++;
          }
        }
      });

      return {
        name: category.label,
        value: count, // Overall mentions
        greatestImpact: greatestImpactCount, // Greatest personal impact count
        percentage: data.length > 0 ? (count / data.length) * 100 : 0,
        greatestImpactPercentage:
          data.length > 0 ? (greatestImpactCount / data.length) * 100 : 0,
      };
    });

    // Sort by count descending
    return categoryCounts.sort((a, b) => a.value - b.value);
  }, [data]);

  // If no valid data, show empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const data1 = params[0].data;
        const data2 = params[1].data;
        return `
          <div style="font-weight:bold;margin-bottom:5px">${data1.name}</div>
          <div>Overall mentions: ${data1.value} (${data1.percentage.toFixed(
          1
        )}%)</div>
          <div>Greatest personal impact: ${
            data2.value
          } (${data2.percentage.toFixed(1)}%)</div>
        `;
      },
    },
    legend: {
      data: [
        {
          name: "Overall Negative Impact",
          itemStyle: {
            color: "#7f1d1d",
          },
        },
        {
          name: "Greatest Personal Impact",
          itemStyle: {
            color: "#000000",
            opacity: 0.7,
          },
        },
      ],
      bottom: 10,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Number of Responses",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: "{value}",
      },
    },
    yAxis: {
      type: "category",
      data: negativeImpactsData.map((item) => item.name),
      axisLabel: {
        width: 250,
        overflow: "break",
        interval: 0,
        align: "right",
      },
    },
    series: [
      {
        name: "Overall Negative Impact",
        type: "bar",
        data: negativeImpactsData.map((item) => {
          return {
            value: item.value,
            name: item.name,
            percentage: item.percentage,
            itemStyle: {
              color: "#7f1d1d", // red-900
            },
          };
        }),
        label: {
          show: true,
          position: "insideRight",
          formatter: function (params: any) {
            return `${params.data.percentage.toFixed(1)}%`;
          },
          color: "#fff",
        },
      },
      {
        name: "Greatest Personal Impact",
        type: "bar",
        data: negativeImpactsData.map((item) => {
          return {
            value: item.greatestImpact,
            name: item.name,
            percentage: item.greatestImpactPercentage,
            itemStyle: {
              color: "#000000",
              opacity: 0.7,
            },
          };
        }),
        label: {
          show: true,
          position: "insideRight",
          formatter: function (params: any) {
            return params.data.value > 0
              ? `${params.data.percentage.toFixed(1)}%`
              : "";
          },
          color: "#fff",
        },
        emphasis: {
          itemStyle: {
            color: "#000000",
            opacity: 0.7,
          },
        },
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: "800px" }}
      graphId={graphId}
      title={title || "Most Significant Negative Impacts on Quality of Life"}
      subtitle={
        subtitle ||
        "What residents dislike most about living and working in Nashville"
      }
    />
  );
};
