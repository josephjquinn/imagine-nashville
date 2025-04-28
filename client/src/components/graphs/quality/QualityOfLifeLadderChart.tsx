import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";
import { BasePieChart } from "../base/BasePieChart";

interface QualityOfLifeLadderChartProps {
  data: SurveyResponse[];
  graphId: string;
  title?: string;
  subtitle?: string;
}

const QualityOfLifeLadderChart: React.FC<QualityOfLifeLadderChartProps> = ({
  data,
  graphId,
  title = "Quality of Life Ladder Averages",
  subtitle = "Average ladder step over time",
}) => {
  // Check if we have valid data for either chart
  const hasValidData = data.some(
    (response) =>
      (response.Q200 !== undefined && response.Q200 !== null) ||
      (response.HQ211 !== undefined && response.HQ211 !== null)
  );

  // Process the data for the bar chart
  const processedData = useMemo(() => {
    const timePoints = [
      { key: "Q200", label: "5 Years Ago" },
      { key: "Q205", label: "Today" },
      { key: "Q210", label: "5 Years From Now" },
    ];

    const averages = timePoints.map(({ key }) => {
      const validResponses = data.filter(
        (response) => response[key] !== undefined && response[key] !== null
      );
      const sum = validResponses.reduce(
        (acc, response) => acc + (Number(response[key]) || 0),
        0
      );
      return sum / (validResponses.length || 1);
    });

    const minValue = Math.min(...averages);
    const maxValue = Math.max(...averages);
    const range = maxValue - minValue;
    const yAxisMin = Math.floor(minValue - range * 0.2);
    const yAxisMax = Math.ceil(maxValue + range * 0.2);

    return {
      timePoints,
      averages,
      yAxisRange: [yAxisMin, yAxisMax],
    };
  }, [data]);

  const getAnswerText = (value: string) => {
    switch (value) {
      case "1":
        return "Decreasing";
      case "2":
        return "Stable";
      case "3":
        return "Improving";
      default:
        return "Unknown";
    }
  };

  // Bar chart options
  const barOption: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const param = params[0];
        return `${param.name}: ${param.value.toFixed(1)} / 10`;
      },
    },
    grid: {
      left: "8%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: processedData.timePoints.map((tp) => tp.label),
      axisLabel: {
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: "value",
      min: processedData.yAxisRange[0],
      max: processedData.yAxisRange[1],
      interval: 0.5,
      name: "Ladder Step",
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
      axisLabel: {
        formatter: (value: number) => value.toFixed(1),
        fontSize: 14,
        fontWeight: "bold",
        margin: 15,
      },
      axisLine: {
        lineStyle: {
          width: 2,
        },
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          width: 1,
        },
      },
    },
    series: [
      {
        name: "Average Ladder Step",
        type: "bar",
        data: processedData.averages.map((value) => Number(value.toFixed(1))),
        barWidth: "60%",
        barGap: "0%",
        itemStyle: {
          color: "#5470c6",
        },
        label: {
          show: true,
          position: "inside",
          distance: 15,
          formatter: (params: any) => params.value.toFixed(1),
          fontSize: 16,
          fontWeight: "bold",
          color: "#fff",
        },
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {!hasValidData ? (
        <div className="flex-1 flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg font-medium">
            No valid equitable quality of life data available
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <BaseGraph
              option={barOption}
              style={{ height: "400px", minHeight: "300px" }}
              graphId={`${graphId}-bar`}
              title={title}
              subtitle={subtitle}
            />
          </div>
          <div className="flex-1">
            <BasePieChart
              data={data}
              field="HQ211"
              title="Perceived Change in Quality of Life"
              getAnswerText={getAnswerText}
              customColors={["#ff4d4f", "#faad14", "#52c41a"]}
              radius={["40%", "70%"]}
              showLegend={true}
              legendPosition="left"
              graphId={`${graphId}-pie`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default QualityOfLifeLadderChart;
