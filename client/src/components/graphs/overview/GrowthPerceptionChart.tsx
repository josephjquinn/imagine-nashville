import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";
import { useIsMobile } from "@/hooks/useIsMobile";

// Define the growth perception categories and their labels
const GROWTH_PERCEPTION_CATEGORIES = [
  { value: 1, label: "Things are much worse", color: "#d32f2f" },
  { value: 2, label: "Things are somewhat worse", color: "#f57c00" },
  { value: 3, label: "Neither better nor worse", color: "#9e9e9e" },
  { value: 4, label: "Things are somewhat better", color: "#7cb342" },
  { value: 5, label: "Things are much better", color: "#388e3c" },
];

interface GrowthPerceptionChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const GrowthPerceptionChart: React.FC<GrowthPerceptionChartProps> = ({
  data,
  graphId,
}) => {
  const isMobile = useIsMobile();

  // The field we're analyzing
  const FIELD = "Q500";

  // Process the survey data
  const processedData = useMemo(() => {
    // Initialize counters for each response option
    const counts = Object.fromEntries(
      GROWTH_PERCEPTION_CATEGORIES.map((category) => [category.value, 0])
    );

    let total = 0;

    // Count responses for each option
    data.forEach((response) => {
      const value = response[FIELD];
      if (value !== undefined && value !== null && value !== "") {
        const perception = parseInt(String(value), 10);
        if (!isNaN(perception) && perception >= 1 && perception <= 5) {
          counts[perception]++;
          total++;
        }
      }
    });

    // Prepare chart data format
    const chartData = GROWTH_PERCEPTION_CATEGORIES.map((category) => ({
      name: category.label,
      value: counts[category.value],
      itemStyle: {
        color: category.color,
      },
    }));

    return {
      chartData,
      total,
    };
  }, [data]);

  // If no valid data, show empty state
  if (processedData.total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid growth perception data available
        </p>
      </div>
    );
  }

  // Create the chart configuration
  const option: EChartsOption = {
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
          Percentage: ${percentage}%<br/>
          Total Responses: ${processedData.total}
        </div>`;
      },
    },
    legend: {
      type: "plain",
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
    series: [
      {
        name: "Growth Perception",
        type: "pie",
        radius: isMobile ? ["25%", "60%"] : ["30%", "70%"],
        center: isMobile ? ["50%", "55%"] : ["60%", "55%"],
        roseType: "radius",
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
          fontSize: isMobile ? 12 : 14,
          fontWeight: "bold",
        },
        data: processedData.chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
          label: {
            show: true,
            fontSize: isMobile ? 12 : 14,
            fontWeight: "bold",
          },
        },
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: "400px" }}
      graphId={graphId}
      title="Perceptions of Nashville's Growth"
      subtitle="Is Nashville's rapid growth making things better or worse?"
    />
  );
};
