import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const EDUCATION_GOALS = [
  {
    value: "1",
    label: "Ensure they can support themselves as an adult in the real world",
  },
  {
    value: "2",
    label: "Ensure they are prepared for college",
  },
  {
    value: "3",
    label:
      "Ensure they have the skills they will need to be successful in the workplace",
  },
  {
    value: "4",
    label:
      "Provide a way to lift children out of poverty and level the playing field for their future",
  },
  {
    value: "5",
    label:
      "Ensure they are well informed and able to engage in civic and political matters in their community",
  },
];

interface EducationGoalsChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const EducationGoalsChart: React.FC<EducationGoalsChartProps> = ({
  data,
  graphId,
}) => {
  const { processedData } = useMemo(() => {
    const goalCounts = new Map<string, { top: number; second: number }>();

    // Initialize counts
    EDUCATION_GOALS.forEach((goal) => {
      goalCounts.set(goal.value, { top: 0, second: 0 });
    });

    let validResponses = 0;

    // Count responses
    data.forEach((response) => {
      const topChoice = response["Q650"];
      const secondChoice = response["Q655"];

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
    const results = EDUCATION_GOALS.map((goal) => {
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
          color: "#6366f1", // indigo-500
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
          color: "#a5b4fc", // indigo-300
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
      title="Education Goals: Top Priorities"
      subtitle="% Selected as Top 2 Goals"
    />
  );
};
