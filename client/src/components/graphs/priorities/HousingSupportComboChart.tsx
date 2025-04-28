import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const Q620_MAPPINGS = {
  "1": "Everyone treated the same",
  "2": "Some groups need special support",
};

const Q625_GROUPS = [
  { field: "Q625_A", label: "Seniors" },
  { field: "Q625_B", label: "Veterans" },
  { field: "Q625_C", label: "People with disabilities" },
  { field: "Q625_D", label: "Musicians and artists" },
  { field: "Q625_E", label: "Low-income individuals and families" },
  { field: "Q625_F", label: "New people moving into the region" },
  { field: "Q625_G", label: "Disadvantaged minority or ethnic populations" },
  {
    field: "Q625_H",
    label: "Critical community workforce (teachers, police, firefighters)",
  },
];

interface HousingSupportComboChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const HousingSupportComboChart: React.FC<
  HousingSupportComboChartProps
> = ({ data, graphId }) => {
  // Pie chart data for Q620
  const q620PieData = useMemo(() => {
    const counts: Record<"1" | "2", number> = { "1": 0, "2": 0 };
    data.forEach((response) => {
      const value = response["Q620"];
      if (value === "1" || value === "2") {
        counts[value as "1" | "2"]++;
      }
    });
    const total = counts["1"] + counts["2"];
    return Object.entries(Q620_MAPPINGS).map(([value, label]) => ({
      name: label,
      value: counts[value as "1" | "2"],
      percentage: total > 0 ? (counts[value as "1" | "2"] / total) * 100 : 0,
    }));
  }, [data]);

  // Bar chart data for Q625
  const q625BarData = useMemo(() => {
    const respondentsWithSelection = data.filter((response) =>
      Q625_GROUPS.some((group) => response[group.field] === "1")
    );
    const denominator = respondentsWithSelection.length;
    const groupCounts = Q625_GROUPS.map((group) => {
      let count = 0;
      respondentsWithSelection.forEach((response) => {
        if (response[group.field] === "1") {
          count++;
        }
      });
      return {
        name: group.label,
        value: count,
      };
    });
    return groupCounts
      .map((g) => ({
        ...g,
        percentage: denominator > 0 ? (g.value / denominator) * 100 : 0,
        denominator,
      }))
      .sort((a, b) => a.percentage - b.percentage);
  }, [data]);

  const option: EChartsOption = {
    title: [
      {
        text: "Should some groups get special support?",
        left: "20%",
        top: 0,
        textAlign: "center",
      },
      {
        text: "Who most deserves special support for housing?",
        left: "70%",
        top: 0,
        textAlign: "center",
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        if (params.seriesIndex === 0) {
          return `<strong>${params.name}</strong><br/>Count: ${
            params.value
          }<br/>Percentage: ${params.percent.toFixed(1)}%`;
        } else {
          const d = params.data;
          return `<strong>${d.name}</strong><br/>Count: ${
            d.value
          }<br/>Percentage: ${d.percentage.toFixed(1)}%<br/>Denominator: ${
            d.denominator
          }`;
        }
      },
    },
    legend: [
      {
        orient: "vertical",
        left: "5%",
        top: "10%",
        data: q620PieData.map((item) => item.name),
      },
    ],
    grid: [
      {
        left: "45%",
        right: "5%",
        top: "10%",
        bottom: "15%",
        containLabel: true,
      },
    ],
    xAxis: [
      {
        type: "value",
        name: "Percentage of Respondents",
        max: 100,
        axisLabel: { formatter: "{value}%" },
        gridIndex: 0,
      },
    ],
    yAxis: [
      {
        type: "category",
        data: q625BarData.map((g) => g.name),
        axisLabel: {
          width: 300,
          overflow: "break",
          interval: 0,
          align: "right",
        },
        gridIndex: 0,
      },
    ],
    series: [
      {
        type: "pie",
        radius: ["35%", "60%"],
        center: ["20%", "55%"],
        data: q620PieData,
        label: {
          formatter: "{d}%",
        },
      },
      {
        name: "Selected as Top 3",
        type: "bar",
        barMaxWidth: 40,
        itemStyle: {
          color: "#3b82f6", // blue-500
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: "right",
          formatter: (params: any) => `${params.data.percentage.toFixed(1)}%`,
          color: "#666",
          distance: 5,
        },
        data: q625BarData,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: "500px", width: "100%" }}
      graphId={graphId}
    />
  );
};
