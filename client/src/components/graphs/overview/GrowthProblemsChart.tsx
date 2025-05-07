import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

// Fields from the survey data about growth problems with their corresponding values
const GROWTH_PROBLEMS = [
  { value: "1", label: "Loss of sense of community" },
  { value: "2", label: "Growing traffic concerns" },
  { value: "3", label: "Increased crime" },
  { value: "4", label: "Too many people who aren't like me" },
  { value: "5", label: "Just too many people - too crowded" },
  { value: "6", label: "Lack of shared values" },
  {
    value: "7",
    label: "Important groups and parts of the city are being left behind",
  },
  { value: "8", label: "Lack of affordable housing" },
  { value: "9", label: "Lack of local transit" },
  { value: "10", label: "K-12 public schools are being left behind" },
  { value: "11", label: "Too many tourists who are getting out of hand" },
  {
    value: "12",
    label:
      "Local infrastructure not able to keep up with growth and starting to crumble",
  },
  { value: "13", label: "No one wants to go to Downtown & Broadway anymore" },
  {
    value: "14",
    label:
      "Neighborhoods in core parts of the city being torn apart because of development",
  },
  { value: "15", label: "None of the above" },
];

interface GrowthProblemsChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const GrowthProblemsChart: React.FC<GrowthProblemsChartProps> = ({
  data,
  title,
  subtitle,
  graphId,
}) => {
  // Process data to count selections for each growth problem
  const { growthProblemsData, totalValidResponses } = useMemo(() => {
    // Initialize counters for each problem
    const problemCounts = new Map<string, number>();
    GROWTH_PROBLEMS.forEach((problem) => {
      problemCounts.set(problem.value, 0);
    });

    let totalValidResponses = 0;
    // Count selections across all three choices
    data.forEach((response) => {
      let hasValidResponse = false;
      // Check each of the three choices (Q525_1, Q525_2, Q525_3)
      ["Q525_1", "Q525_2", "Q525_3"].forEach((field) => {
        const value = response[field];
        if (value && value !== "" && value !== "0" && value !== "15") {
          // Exclude "None of the above"
          problemCounts.set(
            String(value),
            (problemCounts.get(String(value)) || 0) + 1
          );
          hasValidResponse = true;
        }
      });
      if (hasValidResponse) {
        totalValidResponses++;
      }
    });

    // Convert to percentage and format for chart
    const results = GROWTH_PROBLEMS.filter((problem) => problem.value !== "15") // Exclude "None of the above" from visualization
      .map((problem) => ({
        name: problem.label,
        value: problemCounts.get(problem.value) || 0,
        percentage:
          totalValidResponses > 0
            ? ((problemCounts.get(problem.value) || 0) / totalValidResponses) *
              100
            : 0,
      }));

    // Sort by percentage ascending (highest at bottom)
    return {
      growthProblemsData: results.sort((a, b) => a.percentage - b.percentage),
      totalValidResponses,
    };
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
    title: {
      text: title || "Problems Caused by Growth: How to Talk about Growth",
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      subtext: subtitle || "% Selected as Top 3 Reason",
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
        return `<div>
          <strong>${data.name}</strong><br/>
          Count: ${data.rawValue}<br/>
          Percentage: ${data.percentage.toFixed(1)}%<br/>
          Total Responses: ${totalValidResponses}
        </div>`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "5%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Percentage of Respondents",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: "{value}%",
      },
      max: 60,
    },
    yAxis: {
      type: "category",
      data: growthProblemsData.map((item) => item.name),
      axisLabel: {
        width: 250,
        overflow: "break",
        interval: 0,
        align: "right",
        color: "#000000",
      },
      zlevel: 2,
    },
    series: [
      {
        name: "Selected as Top 3",
        type: "bar",
        barWidth: "90%",
        barCategoryGap: "20%",
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        zlevel: 1,
        data: growthProblemsData.map((item, index, array) => {
          const color = "#991b1b"; // red-800 - A rich, dark red

          const isTop3 = index >= array.length - 3;

          return {
            value: item.percentage,
            name: item.name,
            rawValue: item.value,
            percentage: item.percentage,
            itemStyle: {
              color: color,
              backgroundColor: isTop3 ? "rgba(255, 250, 150, 0.35)" : undefined,
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
        markArea: {
          silent: true,
          zlevel: 0,
          data: [
            [
              {
                yAxis: growthProblemsData.length - 3,
                xAxis: 0,
                x: "0%", // Start from the very left
              },
              {
                yAxis: growthProblemsData.length - 1,
                xAxis: 60, // Match the xAxis max
                x: "100%", // Extend to the very right
              },
            ],
          ],
          itemStyle: {
            color: "rgba(255, 250, 150, 0.35)",
            borderColor: "rgba(255, 200, 0, 0.8)",
            borderWidth: 2,
            borderRadius: [4, 8, 8, 4],
          },
        },
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: "700px" }}
      graphId={graphId}
      title="Problems Caused by Growth: How to Talk about Growth"
      subtitle="% Selected as Top 3 Reason"
    />
  );
};
