import React, { useMemo } from "react";
import { BaseGraph } from "./BaseGraph";
import type { EChartsOption } from "echarts";
import type { SurveyResponse } from "@/types/survey";
import { useIsMobile } from "@/hooks/useIsMobile";

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface BasePieChartProps {
  data: SurveyResponse[];
  field: string;
  title?: string;
  emptyStateMessage?: string;
  getAnswerText: (value: string) => string;
  customColors?: string[];
  radius?: [string, string];
  showLegend?: boolean;
  legendPosition?: "left" | "right" | "top" | "bottom";
  legendTop?: number;
  tooltipFormatter?: (params: any) => string;
  graphId: string;
  center?: [string, string];
}

export const BasePieChart: React.FC<BasePieChartProps> = ({
  data,
  field,
  title,
  emptyStateMessage = "No valid data available",
  getAnswerText,
  customColors,
  radius = ["40%", "70%"],
  showLegend = true,
  legendPosition = "left",
  legendTop = 0,
  tooltipFormatter,
  graphId,
  center = ["50%", "55%"],
}) => {
  const isMobile = useIsMobile();

  const processedData = useMemo(() => {
    const distribution = data.reduce((acc, response) => {
      const value = response[field];
      if (value !== undefined && value !== null && value !== "") {
        const decodedValue = getAnswerText(String(value));
        acc[decodedValue] = (Number(acc[decodedValue]) || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution)
      .map(([name, value]) => ({
        name,
        value: value as number,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data, field, getAnswerText]);

  if (processedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">{emptyStateMessage}</p>
      </div>
    );
  }

  const total = processedData.reduce((sum, item) => sum + item.value, 0);

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter:
        tooltipFormatter ||
        function (params: any) {
          const count = params.value;
          const percentage =
            total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
          return `<div>
          <strong>${params.name}</strong><br/>
          Count: ${count}<br/>
          Percentage: ${percentage}%<br/>
          Total Responses: ${total}
        </div>`;
        },
    },
    legend: showLegend
      ? {
          orient:
            legendPosition === "left" || legendPosition === "right"
              ? "vertical"
              : "horizontal",
          [legendPosition]:
            legendPosition === "left" || legendPosition === "right"
              ? 10
              : "center",
          top: legendTop,
          type: "scroll",
          textStyle: {
            width:
              legendPosition === "left" || legendPosition === "right"
                ? isMobile
                  ? 100
                  : 140
                : undefined,
            overflow: "break",
            lineHeight: isMobile ? 12 : 14,
            fontSize: isMobile ? 10 : 11,
          },
          backgroundColor: "rgba(0,0,0,0.03)",
          padding: isMobile ? [5, 5, 5, 5] : [10, 10, 10, 10],
          borderRadius: 5,
        }
      : undefined,
    series: [
      {
        type: "pie",
        radius: isMobile ? ["35%", "60%"] : radius,
        center: isMobile ? ["50%", "40%"] : center,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: isMobile ? 5 : 10,
          borderColor: "#fff",
          borderWidth: isMobile ? 1 : 2,
          color: customColors ? undefined : undefined,
        },
        label: {
          show: true,
          formatter: function (params: any) {
            const percentage =
              total > 0 ? ((params.value / total) * 100).toFixed(1) : "0.0";
            return `${percentage}%`;
          },
          fontSize: isMobile ? 11 : 14,
          fontWeight: "bold",
          distanceToLabelLine: isMobile ? 5 : 16,
          alignTo: isMobile ? "labelLine" : "labelLine",
          edgeDistance: isMobile ? "10%" : "16%",
          position: "outside",
        },
        labelLine: {
          show: true,
          length: isMobile ? 5 : 24,
          length2: isMobile ? 3 : 8,
          smooth: isMobile ? false : true,
          minTurnAngle: isMobile ? 0 : 45,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        data: processedData,
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      graphId={graphId}
      style={{ height: isMobile ? "260px" : "400px" }}
      title={title}
    />
  );
};
