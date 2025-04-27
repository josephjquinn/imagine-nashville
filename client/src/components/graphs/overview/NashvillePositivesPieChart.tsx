import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

// TODO: Update with correct type import once available
interface SurveyResponse {
  [key: string]: any;
}

interface NashvillePositivesPieChartProps {
  data: SurveyResponse[];
  graphId: string;
  title?: string;
}

export const NashvillePositivesPieChart: React.FC<
  NashvillePositivesPieChartProps
> = ({ data, graphId, title = "Positive Sentiment in Nashville" }) => {
  const processedData = useMemo(() => {
    let total = 0;
    let count = 0;

    data.forEach((response) => {
      // Use Q230_1 for public survey and Q230_2 for formal survey
      const value = response["Q230_1"] || response["Q230_2"];

      if (value !== undefined && value !== null && value !== "") {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
          total += numValue;
          count++;
        }
      }
    });

    const mean = count > 0 ? Math.round(total / count) : 0;

    return {
      mean,
      count,
    };
  }, [data]);

  if (processedData.count === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        fontSize: 16,
        color: "#374151",
      },
      subtext:
        "Percentage of things that are positive in Nashville (Mean Score)",
      subtextStyle: {
        fontSize: 12,
        color: "#6b7280",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        return `<div>
          <strong>Sentiment Score</strong><br/>
          ${params.value}%
        </div>`;
      },
    },
    series: [
      {
        type: "gauge",
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: "70%",
        center: ["50%", "55%"],
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [processedData.mean / 100, "#FFB800"],
              [1, "#E8E8E8"],
            ],
          },
        },
        pointer: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          offsetCenter: [0, 0],
          fontSize: 36,
          fontWeight: "bold",
          color: "#FFB800",
        },
        data: [
          {
            value: processedData.mean,
          },
        ],
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: "400px" }}
      graphId={graphId}
      title="What Makes Nashville Great"
      subtitle="Top positive aspects of living in Nashville"
    />
  );
};
