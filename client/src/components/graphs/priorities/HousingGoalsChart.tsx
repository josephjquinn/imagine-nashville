import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const HOUSING_GOALS = [
  {
    value: "1",
    label: "Eliminate homelessness",
  },
  {
    value: "2",
    label:
      "Ensure we are building a variety of housing options in all our neighborhoods to reduce housing shortages and lower housing costs",
  },
  {
    value: "3",
    label:
      "Ensure people can afford to stay in their homes and are not being forced out",
  },
  {
    value: "4",
    label:
      "Ensure low-cost housing options are equally available to people of all walks of life",
  },
  {
    value: "5",
    label:
      "Make sure there is plenty of affordable housing in the communities of Nashville for people who keep the city going (musicians, artists, teachers, firefighters, police officers, etc.)",
  },
];

interface HousingGoalsChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const HousingGoalsChart: React.FC<HousingGoalsChartProps> = ({
  data,
  graphId,
}) => {
  const { processedData } = useMemo(() => {
    const goalCounts = new Map<string, { top: number; second: number }>();

    // Initialize counts
    HOUSING_GOALS.forEach((goal) => {
      goalCounts.set(goal.value, { top: 0, second: 0 });
    });

    let validResponses = 0;

    // Count responses
    data.forEach((response) => {
      const topChoice = response["Q600"];
      const secondChoice = response["Q605"];

      if (topChoice || secondChoice) {
        validResponses++;
      }

      if (topChoice && topChoice !== "") {
        const current = goalCounts.get(topChoice) || { top: 0, second: 0 };
        goalCounts.set(topChoice, { ...current, top: current.top + 1 });
      }

      if (secondChoice && secondChoice !== "") {
        const current = goalCounts.get(secondChoice) || { top: 0, second: 0 };
        goalCounts.set(secondChoice, {
          ...current,
          second: current.second + 1,
        });
      }
    });

    // Process data for chart
    const results = HOUSING_GOALS.map((goal) => {
      const counts = goalCounts.get(goal.value) || { top: 0, second: 0 };
      return {
        name: goal.label,
        topPercentage: (counts.top / validResponses) * 100,
        secondPercentage: (counts.second / validResponses) * 100,
        total: counts.top + counts.second,
        totalPercentage: ((counts.top + counts.second) / validResponses) * 100,
        rawTop: counts.top,
        rawSecond: counts.second,
      };
    });

    // Sort by total percentage ascending (biggest bars on top)
    return {
      processedData: results.sort(
        (a, b) => a.totalPercentage - b.totalPercentage
      ),
      totalResponses: validResponses,
    };
  }, [data]);

  const option: EChartsOption = {
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
            <div style="margin: 4px 0;">Top Choice: ${
              data.rawTop
            } (${data.topPercentage.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Second Choice: ${
              data.rawSecond
            } (${data.secondPercentage.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Total: ${
              data.total
            } (${data.totalPercentage.toFixed(1)}%)</div>
          </div>
        `;
      },
    },
    legend: {
      data: ["Top", "Second"],
      bottom: 0,
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
      name: "Percentage of Respondents",
      max: 100,
      axisLabel: {
        formatter: "{value}%",
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
        name: "Top",
        type: "bar",
        stack: "total",
        barMaxWidth: 40,
        itemStyle: {
          color: "#059669", // emerald-600
        },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.topPercentage > 5
              ? `${Math.round(params.data.topPercentage)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.topPercentage,
          name: item.name,
          rawTop: item.rawTop,
          rawSecond: item.rawSecond,
          topPercentage: item.topPercentage,
          secondPercentage: item.secondPercentage,
          total: item.total,
          totalPercentage: item.totalPercentage,
        })),
      },
      {
        name: "Second",
        type: "bar",
        stack: "total",
        barMaxWidth: 40,
        itemStyle: {
          color: "#34d399", // emerald-400
        },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.secondPercentage > 5
              ? `${Math.round(params.data.secondPercentage)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.secondPercentage,
          name: item.name,
          rawTop: item.rawTop,
          rawSecond: item.rawSecond,
          topPercentage: item.topPercentage,
          secondPercentage: item.secondPercentage,
          total: item.total,
          totalPercentage: item.totalPercentage,
        })),
      },
      {
        name: "Total",
        type: "bar",
        stack: "total",
        itemStyle: {
          color: "none",
          borderWidth: 0,
        },
        label: {
          show: true,
          position: "right",
          formatter: function (params: any) {
            return `${Math.round(params.data.totalPercentage)}%`;
          },
          color: "#666",
          distance: 5,
        },
        data: processedData.map((item) => ({
          value: 0,
          name: item.name,
          rawTop: item.rawTop,
          rawSecond: item.rawSecond,
          topPercentage: item.topPercentage,
          secondPercentage: item.secondPercentage,
          total: item.total,
          totalPercentage: item.totalPercentage,
        })),
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      graphId={graphId}
      title="Housing Goals: Top Priorities"
      subtitle="% Selected as Top 2 Goals"
    />
  );
};
