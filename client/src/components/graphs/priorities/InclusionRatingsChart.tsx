import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";
import { SurveyResponse } from "@/types/survey";
import { useIsMobile } from "@/hooks/useIsMobile";
// Inclusion categories
const INCLUSION_CATEGORIES = {
  EXCLUDED: "Excluded (1-4)",
  SOFT_INCLUSION: "Soft Inclusion (5-7)",
  INCLUDED: "Included (8-10)",
};

// Default inclusion fields for Nashville inclusion ratings (Q540 fields)
const DEFAULT_INCLUSION_FIELDS = [
  { field: "Q540_A", label: "Individuals who are men" },
  { field: "Q540_B", label: "Individuals who are women" },
  { field: "Q540_C", label: "Individuals who are White" },
  { field: "Q540_D", label: "Individuals who are African American/Black" },
  { field: "Q540_E", label: "Individuals who are Hispanic/Latin American" },
  { field: "Q540_F", label: "Individuals who are immigrants" },
  { field: "Q540_G", label: "Individuals who are adults 65 and older" },
  { field: "Q540_H", label: "Individuals who are in low-income families" },
  {
    field: "Q540_I",
    label: "Individuals who are lesbian, gay, bisexual, transgender, etc.",
  },
];

interface InclusionRatingsChartProps {
  data: SurveyResponse[];
  title?: string;
  inclusionFields?: Array<{ field: string; label: string }>;
  subtitle?: string;
  graphId: string;
}

// Type for our processed inclusion data
interface InclusionData {
  group: string;
  excluded: number;
  softInclusion: number;
  included: number;
  count: number;
}

export const InclusionRatingsChart: React.FC<InclusionRatingsChartProps> = ({
  data,
  title,
  inclusionFields = DEFAULT_INCLUSION_FIELDS,
  subtitle,
  graphId,
}) => {
  const isMobile = useIsMobile();
  // Process data to get percentage distributions for each inclusion category
  const inclusionData = useMemo<InclusionData[]>(() => {
    return inclusionFields
      .map(({ field, label }) => {
        // Get all valid ratings for this inclusion category
        const ratings = data
          .map((response) => {
            const value = response[field];
            if (value !== undefined && value !== null && value !== "") {
              const rating = parseInt(String(value), 10);
              return !isNaN(rating) && rating >= 1 && rating <= 10
                ? rating
                : null;
            }
            return null;
          })
          .filter((rating): rating is number => rating !== null);

        // Count ratings by category
        const excluded = ratings.filter((r) => r >= 1 && r <= 4).length;
        const softInclusion = ratings.filter((r) => r >= 5 && r <= 7).length;
        const included = ratings.filter((r) => r >= 8 && r <= 10).length;
        const total = ratings.length;

        // Calculate percentages
        const excludedPct =
          total > 0 ? Math.round((excluded / total) * 100) : 0;
        const softInclusionPct =
          total > 0 ? Math.round((softInclusion / total) * 100) : 0;
        const includedPct =
          total > 0 ? Math.round((included / total) * 100) : 0;

        return {
          group: label,
          excluded: excludedPct,
          softInclusion: softInclusionPct,
          included: includedPct,
          count: total,
        };
      })
      .sort((a, b) => b.included - a.included); // Sort by highest inclusion percentage
  }, [data, inclusionFields]);

  // If no valid data, show empty state
  if (inclusionData.every((item) => item.count === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid inclusion rating data available
        </p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: title || "Who is Outside Looking In?",
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      subtext:
        subtitle ||
        "Perceptions of Inclusion versus self-perceived feelings of Inclusion by subgroup",
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
      formatter: function (params: CallbackDataParams[] | CallbackDataParams) {
        // Ensure params is an array
        const paramsArray = Array.isArray(params) ? params : [params];
        if (paramsArray.length === 0) return "";

        const dataIndex = paramsArray[0].dataIndex as number;
        const groupData = inclusionData[dataIndex];

        let tooltip = `<div style="font-weight:bold;margin-bottom:10px">${groupData.group}</div>`;
        paramsArray.forEach((p) => {
          const colorBlock = `<span style="display:inline-block;margin-right:5px;width:10px;height:10px;background-color:${p.color};"></span>`;
          tooltip += `${colorBlock}${p.seriesName}: ${p.value}%<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      data: [
        INCLUSION_CATEGORIES.EXCLUDED,
        INCLUSION_CATEGORIES.SOFT_INCLUSION,
        INCLUSION_CATEGORIES.INCLUDED,
      ],
      bottom: 0,
      orient: "horizontal",
    },
    grid: {
      left: "30%",
      right: "5%",
      bottom: "15%",
      top: "15%",
      containLabel: false,
    },
    xAxis: {
      type: "value",
      name: "Percentage",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        formatter: "{value}%",
        fontSize: 12,
      },
      max: 100,
    },
    yAxis: {
      type: "category",
      data: inclusionData.map((item) => item.group),
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
      axisLabel: {
        width: isMobile ? 200 : 260,
        overflow: "break",
        interval: 0,
        margin: isMobile ? 200 : 300,
        align: "left",
        fontSize: isMobile ? 9 : 12,
        lineHeight: isMobile ? 14 : 16,
      },
    },
    series: [
      {
        name: INCLUSION_CATEGORIES.EXCLUDED,
        type: "bar",
        stack: "inclusion",
        emphasis: {
          focus: "series",
        },
        data: inclusionData.map((d) => d.excluded),
        label: {
          show: true,
          position: "insideLeft",
          formatter: (params: CallbackDataParams) => {
            const value = params.value as number;
            return value > 15 ? `${value}%` : "";
          },
          fontSize: 12,
          color: "#fff",
        },
        itemStyle: {
          color: "#124991", // Dark blue for excluded (1-4)
        },
      },
      {
        name: INCLUSION_CATEGORIES.SOFT_INCLUSION,
        type: "bar",
        stack: "inclusion",
        emphasis: {
          focus: "series",
        },
        data: inclusionData.map((d) => d.softInclusion),
        label: {
          show: true,
          position: "inside",
          formatter: (params: CallbackDataParams) => {
            const value = params.value as number;
            return value > 15 ? `${value}%` : "";
          },
          fontSize: 12,
          color: "#fff",
        },
        itemStyle: {
          color: "#f7d251", // Yellow for soft inclusion (5-7)
        },
      },
      {
        name: INCLUSION_CATEGORIES.INCLUDED,
        type: "bar",
        stack: "inclusion",
        emphasis: {
          focus: "series",
        },
        data: inclusionData.map((d) => d.included),
        label: {
          show: true,
          position: "inside",
          formatter: (params: CallbackDataParams) => {
            const value = params.value as number;
            return value > 15 ? `${value}%` : "";
          },
          fontSize: 12,
          color: "#fff",
        },
        itemStyle: {
          color: "#f58e31", // Orange for included (8-10)
        },
      },
    ],
  };

  return (
    <BaseGraph option={option} style={{ height: "500px" }} graphId={graphId} />
  );
};
