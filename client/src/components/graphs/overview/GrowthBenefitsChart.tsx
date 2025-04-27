import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const GROWTH_BENEFITS = [
  { value: "1", label: "More jobs/economic opportunity" },
  { value: "2", label: "More housing options" },
  { value: "3", label: "More restaurants, shopping, and entertainment" },
  { value: "4", label: "Attracts new workforce talent to the city" },
  {
    value: "5",
    label:
      "Increases the amount of money and taxes coming into the city to help pay for things",
  },
  {
    value: "6",
    label: "More improvements in roads and infrastructure around the city",
  },
  {
    value: "7",
    label:
      "As Nashville kids grow up they have opportunities and jobs in Nashville",
  },
  {
    value: "8",
    label: "More diversity in the types of people and cultures living here",
  },
  { value: "9", label: "Increases innovation and new ways of doing things" },
  {
    value: "10",
    label: "Greater access to new opportunities and business ventures",
  },
  { value: "11", label: "Better public transportation" },
  { value: "12", label: "Increases property values" },
  {
    value: "13",
    label: "Better funding for education due to increased tax revenue",
  },
  { value: "14", label: "More creativity in the community" },
  {
    value: "15",
    label: "More investment in green spaces and cultural opportunities",
  },
  { value: "16", label: "New sports teams to support" },
  { value: "17", label: "Being the music capital of the country" },
  { value: "18", label: "None of the above" },
];

interface GrowthBenefitsChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
  graphId: string;
}

export const GrowthBenefitsChart: React.FC<GrowthBenefitsChartProps> = ({
  data,
  title,
  subtitle,
  graphId,
}) => {
  // Process data to count selections for each growth benefit
  const { growthBenefitsData, totalValidResponses } = useMemo(() => {
    // Initialize counters for each benefit
    const benefitCounts = new Map<string, number>();
    GROWTH_BENEFITS.forEach((benefit) => {
      benefitCounts.set(benefit.value, 0);
    });

    let totalValidResponses = 0;
    // Count selections across all three choices
    data.forEach((response) => {
      let hasValidResponse = false;
      // Check each of the three choices (Q520_1, Q520_2, Q520_3)
      ["Q520_1", "Q520_2", "Q520_3"].forEach((field) => {
        const value = response[field];
        if (value && value !== "" && value !== "0" && value !== "18") {
          benefitCounts.set(value, (benefitCounts.get(value) || 0) + 1);
          hasValidResponse = true;
        }
      });
      if (hasValidResponse) {
        totalValidResponses++;
      }
    });

    // Convert to percentage and format for chart
    const results = GROWTH_BENEFITS.filter((benefit) => benefit.value !== "18") // Exclude "None of the above"
      .map((benefit) => ({
        name: benefit.label,
        value: benefitCounts.get(benefit.value) || 0,
        percentage:
          totalValidResponses > 0
            ? ((benefitCounts.get(benefit.value) || 0) / totalValidResponses) *
              100
            : 0,
      }));

    // Sort by percentage ascending (highest at bottom)
    return {
      growthBenefitsData: results.sort((a, b) => a.percentage - b.percentage),
      totalValidResponses,
    };
  }, [data]);

  // If no valid data, show empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: title || "Benefits of Growth: Key Positive Impacts",
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      subtext: subtitle || "% Selected as Top 3 Reason",
      subtextStyle: {
        fontSize: 14,
        color: "#666",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const data = params[0].data;
        return `<div>
          <strong>${data.name}</strong><br/>
          Count: ${data.rawValue}<br/>
          Percentage: ${data.percentage.toFixed(1)}%<br/>
          Total Responses: ${totalValidResponses}
        </div>`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Percentage of Respondents",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: "{value}%",
      },
      max: 60,
    },
    yAxis: {
      type: "category",
      data: growthBenefitsData.map((item) => item.name),
      axisLabel: {
        width: 250,
        overflow: "break",
        interval: 0,
        align: "right",
        color: "#000000",
      },
      zlevel: 2,
    },
    series: [
      {
        name: "Selected as Top 3",
        type: "bar",
        barCategoryGap: "30%",
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
        },
        zlevel: 1,
        data: growthBenefitsData.map((item, index, array) => {
          const color = "#166534"; // green-800 - A rich, dark green

          const isTop3 = index >= array.length - 3;

          return {
            value: item.percentage,
            name: item.name,
            rawValue: item.value,
            percentage: item.percentage,
            itemStyle: {
              color: color,
              backgroundColor: isTop3 ? "rgba(255, 250, 150, 0.35)" : undefined,
            },
          };
        }),
        label: {
          show: true,
          position: "insideRight",
          formatter: function (params: any) {
            return `${params.data.percentage.toFixed(1)}%`;
          },
          color: "#fff",
        },
        markArea: {
          silent: true,
          zlevel: 0,
          data: [
            [
              {
                yAxis: growthBenefitsData.length - 3,
                xAxis: 0,
                x: "0%",
              },
              {
                yAxis: growthBenefitsData.length - 1,
                xAxis: 60,
                x: "100%",
              },
            ],
          ],
          itemStyle: {
            color: "rgba(255, 250, 150, 0.35)",
            borderColor: "rgba(255, 200, 0, 0.8)",
            borderWidth: 2,
            borderRadius: [4, 8, 8, 4],
          },
        },
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: "800px" }}
      graphId={graphId}
      title="Benefits of Growth: Key Positive Impacts"
      subtitle="% Selected as Top 3 Reason"
    />
  );
};
