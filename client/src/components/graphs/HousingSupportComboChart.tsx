import React, { useMemo } from "react";
import { BaseGraph } from "./base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/api/public_survey";

const Q620_OPTIONS = [
  { value: "1", label: "Everyone treated the same" },
  { value: "2", label: "Some groups need special support" },
];

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
  title?: string;
  subtitle?: string;
}

export const HousingSupportComboChart: React.FC<
  HousingSupportComboChartProps
> = ({ data, title, subtitle }) => {
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
    return Q620_OPTIONS.map((opt) => ({
      name: opt.label,
      value: counts[opt.value as "1" | "2"],
      percentage:
        total > 0 ? (counts[opt.value as "1" | "2"] / total) * 100 : 0,
    }));
  }, [data]);

  // Bar chart data for Q625
  const q625BarData = useMemo(() => {
    // Find respondents who selected at least one group
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

  // Pie chart option
  const pieOption: EChartsOption = {
    title: {
      text: "Should some groups get special support?",
      left: "center",
      top: 0,
      textStyle: { fontSize: 18, fontWeight: "bold" },
      subtext: "Q620",
      subtextStyle: { fontSize: 13, color: "#666" },
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        return `<strong>${params.name}</strong><br/>Count: ${
          params.value
        }<br/>Percentage: ${params.percent.toFixed(1)}%`;
      },
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "55%"],
        data: q620PieData,
        label: {
          formatter: "{b}: {d}%",
        },
      },
    ],
  };

  // Bar chart option
  const barOption: EChartsOption = {
    title: {
      text: title || "Who most deserves special support for housing?",
      left: "center",
      top: 0,
      textStyle: { fontSize: 18, fontWeight: "bold" },
      subtext:
        subtitle || "% selected as Top 3 (among those who made a selection)",
      subtextStyle: { fontSize: 13, color: "#666" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const d = params[0].data;
        return `<strong>${d.name}</strong><br/>Count: ${
          d.value
        }<br/>Percentage: ${d.percentage.toFixed(1)}%<br/>Denominator: ${
          d.denominator
        }`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: 60,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Percentage of Respondents",
      max: 100,
      axisLabel: { formatter: "{value}%" },
    },
    yAxis: {
      type: "category",
      data: q625BarData.map((g) => g.name),
      axisLabel: {
        width: 300,
        overflow: "break",
        interval: 0,
        align: "right",
      },
    },
    series: [
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
      },
    ],
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
      <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
        <BaseGraph
          option={pieOption}
          style={{ height: "350px", width: "100%" }}
        />
      </div>
      <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <BaseGraph
          option={barOption}
          style={{ height: "500px", width: "100%" }}
        />
      </div>
    </div>
  );
};
