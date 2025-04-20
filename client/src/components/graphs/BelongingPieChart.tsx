import React, { useMemo } from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../api/survey";

// Belonging scale definitions with colors
const BELONGING_SCALE = [
  {
    value: 1,
    label: "I strongly feel I don't belong in Nashville",
    color: "#f56c6c",
  },
  {
    value: 2,
    label: "I somewhat feel like I don't belong in Nashville",
    color: "#e6a23c",
  },
  {
    value: 3,
    label: "I somewhat feel like I do belong in Nashville",
    color: "#409eff",
  },
  {
    value: 4,
    label: "I strongly feel I do belong in Nashville",
    color: "#67c23a",
  },
];

// Define the field and title as constants
const FIELD = "Q240";
const TITLE = "Sense of Belonging in Nashville";

interface BelongingBarChartProps {
  data: SurveyResponse[];
}

export const BelongingBarChart: React.FC<BelongingBarChartProps> = ({
  data,
}) => {
  // Process the belonging sentiment data
  const sentimentData = useMemo(() => {
    // Initialize counters for each option
    const counts = Array(BELONGING_SCALE.length).fill(0);
    let total = 0;

    // Count responses for each option
    data.forEach((response) => {
      const value = response[FIELD];
      if (value !== undefined && value !== null && value !== "") {
        const sentiment = parseInt(String(value), 10);
        if (!isNaN(sentiment) && sentiment >= 1 && sentiment <= 4) {
          counts[sentiment - 1]++;
          total++;
        }
      }
    });

    // Prepare pie chart data format
    const pieData = BELONGING_SCALE.map((item, index) => ({
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
  if (sentimentData.total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid belonging sentiment data available
        </p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: TITLE,
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const count = params.value;
        const percentage =
          sentimentData.total > 0
            ? ((count / sentimentData.total) * 100).toFixed(1)
            : "0.0";

        return `<div>
          <strong>${params.name}</strong><br/>
          Count: ${count}<br/>
          Percentage: ${percentage}%<br/>
          Total Responses: ${sentimentData.total}
        </div>`;
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "middle",
      itemWidth: 25,
      itemHeight: 14,
      textStyle: {
        width: 160,
        overflow: "break",
        lineHeight: 14,
      },
    },
    series: [
      {
        name: "Belonging Sentiment",
        type: "pie",
        radius: ["35%", "70%"],
        center: ["60%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: function (params: any) {
            const percentage =
              sentimentData.total > 0
                ? ((params.value / sentimentData.total) * 100).toFixed(1)
                : "0.0";
            return `${percentage}%`;
          },
        },
        labelLine: {
          show: true,
        },
        data: sentimentData.pieData,
      },
    ],
  };

  return <BaseGraph option={option} style={{ height: "450px" }} />;
};
