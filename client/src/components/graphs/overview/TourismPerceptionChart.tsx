import React, { useMemo, useState, useEffect } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";
import { useIsMobile } from "@/hooks/useIsMobile";

// Define the agreement categories and their colors
const AGREEMENT_CATEGORIES = [
  { value: 5, label: "Strongly Agree", color: "#f4511e" },
  { value: 4, label: "Somewhat Agree", color: "#ff9800" },
  { value: 3, label: "Neither Agree nor Disagree", color: "#9e9e9e" },
  { value: 2, label: "Somewhat Disagree", color: "#616161" },
  { value: 1, label: "Strongly Disagree", color: "#424242" },
];

interface TourismPerceptionChartProps {
  data: SurveyResponse[];
  graphId: string;
}

const TourismPerceptionChart: React.FC<TourismPerceptionChartProps> = ({
  data,
  graphId,
}) => {
  const isMobile = useIsMobile();

  // Process the survey data
  const processedData = useMemo(() => {
    // Define the questions and their fields
    const questions = [
      {
        field: "Q530_A",
        text: "There is too much focus on taking care of the tourists that visit here rather than the people that live here",
      },
      {
        field: "Q530_D",
        text: "Downtown Nashville and Lower Broadway are getting out of control no longer reflect the values or people of Nashville",
      },
      {
        field: "Q530_G",
        text: "There are simply too many tourists visiting Nashville and it is hurting the city",
      },
    ];

    // Process each question
    const results = questions.map((question) => {
      const responses = data.filter(
        (response) =>
          response[question.field] !== undefined &&
          response[question.field] !== null
      );

      const counts = Object.fromEntries(
        AGREEMENT_CATEGORIES.map((category) => [category.value, 0])
      );
      let total = 0;

      responses.forEach((response) => {
        const value = Number(response[question.field]);
        if (!isNaN(value) && value >= 1 && value <= 5) {
          counts[value]++;
          total++;
        }
      });

      // Calculate percentages and prepare chart data
      const chartData = AGREEMENT_CATEGORIES.map((category) => ({
        name: category.label,
        value:
          total > 0
            ? Number(((counts[category.value] / total) * 100).toFixed(1))
            : 0,
        count: counts[category.value],
        itemStyle: {
          color: category.color,
        },
      }));

      // Calculate net agree percentage
      const netAgree = chartData
        .filter(
          (item) =>
            item.name === "Strongly Agree" || item.name === "Somewhat Agree"
        )
        .reduce((sum, item) => sum + item.value, 0);

      return {
        question: question.text,
        chartData,
        total,
        netAgree: Number(netAgree.toFixed(1)),
      };
    });

    return results;
  }, [data]);

  // If no valid data, show empty state
  if (
    processedData.length === 0 ||
    processedData.every((item) => item.total === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid tourism perception data available
        </p>
      </div>
    );
  }

  // Create the chart configuration
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const data = processedData[params.dataIndex].chartData.find(
          (item) => item.name === params.seriesName
        );
        return `
          <div style="padding: 4px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; background-color: ${
                data?.itemStyle?.color
              }; margin-right: 8px;"></span>
              <span style="font-weight: bold;">${params.seriesName}</span>
            </div>
            <div style="margin-left: 18px; line-height: 1.5;">
              <div>Count: ${data?.count} responses</div>
              <div>Percentage: ${params.value}%</div>
              <div>Total Responses: ${
                processedData[params.dataIndex].total
              }</div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      left: isMobile ? "3%" : "15%",
      right: "4%",
      bottom: "3%",
      top: "15%",
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
      data: processedData.map((item) => item.question),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        width: isMobile ? 200 : 300,
        overflow: "break",
        interval: 0,
        fontSize: isMobile ? 10 : 12,
      },
    },
    series: [
      ...AGREEMENT_CATEGORIES.map((category) => ({
        name: category.label,
        type: "bar" as const,
        stack: "total",
        label: {
          show: true,
          formatter: (params: any) => {
            const value = params.value.toFixed(1);
            return value === "0.0" ? "" : `${value}%`;
          },
          position: "inside" as const,
          color: category.value === 3 ? "#000" : "#fff",
          fontSize: isMobile ? 9 : 12,
          fontWeight: "bold" as const,
        },
        itemStyle: {
          color: category.color,
        },
        data: processedData.map(
          (item) =>
            item.chartData.find((d) => d.name === category.label)?.value || 0
        ),
      })),
      {
        type: "bar" as const,
        barWidth: 0,
        label: {
          show: true,
          position: "right" as const,
          formatter: (params: any) => {
            const netAgree = processedData[params.dataIndex].netAgree;
            return `Net Agree: ${netAgree}%`;
          },
          fontSize: isMobile ? 10 : 14,
          fontWeight: "bold" as const,
          color: "#000",
        },
        data: processedData.map(() => 0),
      },
    ],
    legend: isMobile
      ? undefined
      : {
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
    <BaseGraph
      option={option}
      style={{ height: "400px" }}
      graphId={graphId}
      title="Tourism Impact"
      subtitle="How residents perceive tourism's impact on Nashville"
    />
  );
};

export default TourismPerceptionChart;
