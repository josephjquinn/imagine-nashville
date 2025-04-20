import React, { useMemo } from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../api/survey";

// Define the agreement scale with colors
const AGREEMENT_SCALE = [
  {
    value: 1,
    label: "Strongly disagree",
    color: "#f56c6c", // red
  },
  {
    value: 2,
    label: "Somewhat disagree",
    color: "#e6a23c", // orange
  },
  {
    value: 3,
    label: "Somewhat agree",
    color: "#409eff", // blue
  },
  {
    value: 4,
    label: "Strongly agree",
    color: "#67c23a", // green
  },
];

interface TransportationPriorityChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
}

export const TransportationPriorityChart: React.FC<
  TransportationPriorityChartProps
> = ({
  data,
  title = "Public Transportation Priority",
  subtitle = "To what extent do you agree with the statement: Investing in city-wide public transportation is an important priority for Nashville?",
}) => {
  // Process the survey data
  const processedData = useMemo(() => {
    // Initialize counters for each response option
    const counts = Array(AGREEMENT_SCALE.length).fill(0);
    let total = 0;

    // Count responses for each option
    data.forEach((response) => {
      const value = response["Q645"]; // Field for transportation priority
      if (value !== undefined && value !== null && value !== "") {
        const agreement = parseInt(String(value), 10);
        if (!isNaN(agreement) && agreement >= 1 && agreement <= 4) {
          counts[agreement - 1]++;
          total++;
        }
      }
    });

    // Prepare pie chart data format
    const pieData = AGREEMENT_SCALE.map((item, index) => ({
      name: item.label,
      value: counts[index],
      itemStyle: {
        color: item.color,
      },
    }));

    return {
      pieData,
      total,
    };
  }, [data]);

  // If no valid data, show empty state
  if (processedData.total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid transportation priority data available
        </p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: title,
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
      subtext: subtitle,
      subtextStyle: {
        fontSize: 12,
        color: "#666",
        width: 600,
        overflow: "break",
        lineHeight: 16,
      },
      padding: [0, 0, 30, 0],
    },
    grid: {
      top: 120,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const count = params.value;
        const percentage =
          processedData.total > 0
            ? ((count / processedData.total) * 100).toFixed(1)
            : "0.0";

        return `<div>
          <strong>${params.name}</strong><br/>
          Count: ${count}<br/>
          Percentage: ${percentage}%
        </div>`;
      },
    },
    legend: {
      orient: "vertical",
      left: 10,
      top: "center",
      itemWidth: 25,
      itemHeight: 14,
    },
    series: [
      {
        name: "Transportation Priority",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["60%", "55%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: function (params: any) {
            const percentage =
              processedData.total > 0
                ? ((params.value / processedData.total) * 100).toFixed(1)
                : "0.0";
            return `${percentage}%`;
          },
          fontSize: 14,
          fontWeight: "bold",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: processedData.pieData,
      },
    ],
  };

  return <BaseGraph option={option} style={{ height: "450px" }} />;
};
