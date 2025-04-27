import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

// Define the agreement categories and their colors
const AGREEMENT_CATEGORIES = [
  { value: 5, label: "Strongly Agree", color: "#f4511e" },
  { value: 4, label: "Somewhat Agree", color: "#ff9800" },
  { value: 3, label: "Neither Agree nor Disagree", color: "#9e9e9e" },
  { value: 2, label: "Somewhat Disagree", color: "#616161" },
  { value: 1, label: "Strongly Disagree", color: "#424242" },
];

// Define the survey field
const SURVEY_FIELD = "Q530_F";

interface EquitableQualityOfLifeChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const EquitableQualityOfLifeChart: React.FC<
  EquitableQualityOfLifeChartProps
> = ({
  data,
  title = "Equitable Quality of Life",
  subtitle = "The benefits of Nashville's success are being equally shared across all age, race, and income groups",
  graphId,
}) => {
  // Process the survey data
  const processedData = useMemo(() => {
    // Initialize counters for each response option
    const counts = Object.fromEntries(
      AGREEMENT_CATEGORIES.map((category) => [category.value, 0])
    );
    let total = 0;

    // Count responses for each option
    data.forEach((response) => {
      const value = response[SURVEY_FIELD];
      if (value !== undefined && value !== null && value !== "") {
        const agreement = parseInt(String(value), 10);
        if (!isNaN(agreement) && agreement >= 1 && agreement <= 5) {
          counts[agreement]++;
          total++;
        }
      }
    });

    // Calculate percentages and prepare chart data
    const chartData = AGREEMENT_CATEGORIES.map((category) => ({
      name: category.label,
      value:
        total > 0 ? ((counts[category.value] / total) * 100).toFixed(1) : 0,
      count: counts[category.value],
      itemStyle: {
        color: category.color,
      },
    }));

    return {
      chartData,
      total,
    };
  }, [data]);

  // If no valid data, show empty state
  if (processedData.total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid equitable quality of life data available
        </p>
      </div>
    );
  }

  // Create the chart configuration
  const option: EChartsOption = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
      subtext: subtitle,
      subtextStyle: {
        fontSize: 12,
        color: "#666",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const data = processedData.chartData.find(
          (item) => item.name === params.seriesName
        );
        return `
          <div style="padding: 4px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: ${data?.itemStyle?.color}; margin-right: 8px;"></span>
              <span style="font-weight: bold;">${params.seriesName}</span>
            </div>
            <div style="margin-left: 18px; line-height: 1.5;">
              <div>Count: ${data?.count} responses</div>
              <div>Percentage: ${params.value}%</div>
              <div>Total Responses: ${processedData.total}</div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      left: "15%",
      right: "4%",
      bottom: "3%",
      top: "25%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    yAxis: {
      type: "category",
      data: [""],
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: processedData.chartData.map((category) => ({
      name: category.name,
      type: "bar",
      stack: "total",
      label: {
        show: true,
        formatter: "{c}%",
        position: "inside",
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
      },
      itemStyle: {
        color: category.itemStyle.color,
      },
      data: [category.value],
    })),
    legend: {
      orient: "vertical",
      left: 10,
      top: "center",
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        width: 140,
        overflow: "break",
        lineHeight: 14,
        fontSize: 11,
      },
      backgroundColor: "rgba(0,0,0,0.03)",
      padding: [10, 10, 10, 10],
      borderRadius: 5,
    },
  };

  return (
    <BaseGraph option={option} style={{ height: "200px" }} graphId={graphId} />
  );
};
