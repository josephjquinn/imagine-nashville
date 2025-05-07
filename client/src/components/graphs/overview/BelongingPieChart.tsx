import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "../../../api/survey";
import { useIsMobile } from "@/hooks/useIsMobile";

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

// Where people feel greatest sense of belonging (Q245)
const BELONGING_LOCATION_SCALE = [
  {
    value: 1,
    label: "Mostly just within the neighborhood",
    color: "#8b5cf6", // violet
  },
  {
    value: 2,
    label: "Mostly just among other people",
    color: "#ec4899", // pink
  },
  {
    value: 3,
    label: "Mostly just among the people I know",
    color: "#14b8a6", // teal
  },
  {
    value: 4,
    label: "Mostly just among the people I know well",
    color: "#f97316", // orange
  },
  {
    value: 5,
    label: "Not just one group, but among many different people",
    color: "#3b82f6", // blue
  },
];

// Define the fields and title as constants
const BELONGING_FIELD = "Q240";
const BELONGING_LOCATION_FIELD = "Q245";
const TITLE = "Sense of Belonging in Nashville";

interface BelongingBarChartProps {
  data: SurveyResponse[];
  graphId?: string;
}

export const BelongingBarChart: React.FC<BelongingBarChartProps> = ({
  data,
  graphId,
}) => {
  const isMobile = useIsMobile();
  // Process the belonging sentiment data
  const processedData = useMemo(() => {
    // Initialize counters for each option
    const belongingCounts = Array(BELONGING_SCALE.length).fill(0);
    const locationCounts = Array(BELONGING_LOCATION_SCALE.length).fill(0);
    let belongingTotal = 0;
    let locationTotal = 0;

    // Count responses for each option
    data.forEach((response) => {
      // Process Q240 belonging sentiment
      const belongingValue = response[BELONGING_FIELD];
      if (
        belongingValue !== undefined &&
        belongingValue !== null &&
        belongingValue !== ""
      ) {
        const sentiment = parseInt(String(belongingValue), 10);
        if (!isNaN(sentiment) && sentiment >= 1 && sentiment <= 4) {
          belongingCounts[sentiment - 1]++;
          belongingTotal++;
        }
      }

      // Process Q245 belonging location
      const locationValue = response[BELONGING_LOCATION_FIELD];
      if (
        locationValue !== undefined &&
        locationValue !== null &&
        locationValue !== ""
      ) {
        const location = parseInt(String(locationValue), 10);
        if (!isNaN(location) && location >= 1 && location <= 5) {
          locationCounts[location - 1]++;
          locationTotal++;
        }
      }
    });

    // Prepare pie chart data format for belonging sentiment (Q240)
    const belongingPieData = BELONGING_SCALE.map((item, index) => ({
      name: item.label,
      value: belongingCounts[index],
      itemStyle: {
        color: item.color,
      },
    }));

    // Prepare pie chart data format for belonging location (Q245)
    const locationPieData = BELONGING_LOCATION_SCALE.map((item, index) => ({
      name: item.label,
      value: locationCounts[index],
      itemStyle: {
        color: item.color,
      },
    }));

    return {
      belongingPieData,
      locationPieData,
      belongingTotal,
      locationTotal,
    };
  }, [data]);

  // If no valid data at all, show empty state
  if (processedData.belongingTotal === 0 && processedData.locationTotal === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No valid belonging data available</p>
      </div>
    );
  }

  const option: EChartsOption = {
    title: {
      text: TITLE,
      left: "center",
      top: isMobile ? 10 : 0,
      textStyle: {
        fontSize: isMobile ? 14 : 16,
      },
      subtext: isMobile
        ? ""
        : processedData.belongingTotal > 0 && processedData.locationTotal > 0
        ? "Inner: Where people feel greatest sense of belonging, Outer: General feeling of belonging"
        : processedData.belongingTotal > 0
        ? "General feeling of belonging"
        : "Where people feel greatest sense of belonging",
      subtextStyle: {
        fontSize: isMobile ? 0 : 12,
        color: "#666",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const series = params.seriesName;
        const count = params.value;
        const total =
          series === "Belonging Sentiment"
            ? processedData.belongingTotal
            : processedData.locationTotal;

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
    legend: {
      show: !isMobile,
      type: "plain" as const,
      orient: "vertical" as const,
      left: 10,
      top: 90,
      itemWidth: 15,
      itemHeight: 10,
      textStyle: {
        width: 140,
        overflow: "break" as const,
        lineHeight: 14,
        fontSize: 11,
      },
      backgroundColor: "rgba(0,0,0,0.03)",
      padding: [10, 10, 10, 10],
      borderRadius: 5,
      data: [
        ...(processedData.belongingTotal > 0
          ? BELONGING_SCALE.map((item) => item.label)
          : []),
        ...(processedData.locationTotal > 0
          ? BELONGING_LOCATION_SCALE.map((item) => item.label)
          : []),
      ],
    },
    series: [
      ...(processedData.locationTotal > 0
        ? [
            {
              name: "Belonging Location",
              type: "pie" as const,
              radius:
                processedData.belongingTotal > 0
                  ? isMobile
                    ? ["0%", "35%"]
                    : ["0%", "35%"]
                  : ["0%", "65%"],
              center: isMobile ? ["50%", "45%"] : ["65%", "55%"],
              avoidLabelOverlap: true,
              itemStyle: {
                borderRadius: 5,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: true,
                position:
                  processedData.belongingTotal > 0
                    ? ("inner" as const)
                    : ("outer" as const),
                formatter: function (params: any) {
                  const percentage =
                    processedData.locationTotal > 0
                      ? (
                          (params.value / processedData.locationTotal) *
                          100
                        ).toFixed(1)
                      : "0.0";
                  return `${percentage}%`;
                },
                fontSize: isMobile ? 10 : 12,
                color: "#fff",
              },
              labelLine: {
                show: !processedData.belongingTotal,
                length: isMobile ? 10 : 15,
                length2: isMobile ? 5 : 10,
              },
              data: processedData.locationPieData,
              z: 2,
            },
          ]
        : []),
      ...(processedData.belongingTotal > 0
        ? [
            {
              name: "Belonging Sentiment",
              type: "pie" as const,
              radius:
                processedData.locationTotal > 0
                  ? isMobile
                    ? ["45%", "60%"]
                    : ["45%", "65%"]
                  : ["0%", "65%"],
              center: isMobile ? ["50%", "45%"] : ["65%", "55%"],
              avoidLabelOverlap: true,
              itemStyle: {
                borderRadius: 5,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: true,
                formatter: function (params: any) {
                  const percentage =
                    processedData.belongingTotal > 0
                      ? (
                          (params.value / processedData.belongingTotal) *
                          100
                        ).toFixed(1)
                      : "0.0";
                  return `${percentage}%`;
                },
                fontSize: isMobile ? 10 : 12,
              },
              labelLine: {
                length: isMobile ? 10 : 15,
                length2: isMobile ? 5 : 10,
              },
              data: processedData.belongingPieData,
              z: 1,
            },
          ]
        : []),
    ],
  };

  return (
    <BaseGraph
      option={option}
      style={{ height: isMobile ? "450px" : "550px" }}
      graphId={graphId || "belonging-pie"}
      title="Sense of Belonging in Nashville"
      subtitle="How residents feel about their connection to the city"
    />
  );
};
