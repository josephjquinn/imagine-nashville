import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const TRANSPORTATION_GOALS = [
  {
    value: "1",
    label:
      "Make it easier to get around inside the neighborhoods and communities where people live",
  },
  {
    value: "2",
    label:
      "Make it easier to get around Nashville—to and from downtown and from one place to another in the region (connecting different parts of the City and Downtown better)",
  },
  {
    value: "3",
    label:
      "Ensure everyone has good access to downtown and the important parts of the region—make transportation options equally accessible to all across Nashville/Davidson Co.",
  },
  {
    value: "4",
    label:
      "Improve transportation safety and reduce crashes and personal injuries",
  },
];

interface TransportationGoalsChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const TransportationGoalsChart: React.FC<
  TransportationGoalsChartProps
> = ({ data, graphId }) => {
  const { processedData } = useMemo(() => {
    const goalCounts = new Map<string, { top: number; second: number }>();

    // Initialize counts
    TRANSPORTATION_GOALS.forEach((goal) => {
      goalCounts.set(goal.value, { top: 0, second: 0 });
    });

    let validResponses = 0;

    // Count responses
    data.forEach((response) => {
      const topChoice = response["Q630"];
      const secondChoice = response["Q635"];

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
    const results = TRANSPORTATION_GOALS.map((goal) => {
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

    // Sort by total percentage descending
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
      left: "42%",
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
      nameLocation: "middle",
      nameGap: 30,
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
          color: "#f59e0b", // amber-500
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
          color: "#fcd34d", // amber-300
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
      title="Transportation Goals: Top Priorities"
      subtitle="% Selected as Top 2 Goals"
    />
  );
};
