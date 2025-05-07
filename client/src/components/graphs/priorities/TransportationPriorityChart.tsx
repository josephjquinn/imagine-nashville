import React, { useMemo } from "react";
import { BasePieChart } from "../base/BasePieChart";
import { SurveyResponse } from "../../../api/survey";

// Define the agreement scale with colors and mappings
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

const TRANSPORTATION_MAPPINGS = {
  "1": "Strongly disagree",
  "2": "Somewhat disagree",
  "3": "Somewhat agree",
  "4": "Strongly agree",
};

interface TransportationPriorityChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const TransportationPriorityChart: React.FC<
  TransportationPriorityChartProps
> = ({ data, graphId }) => {
  const getAnswerText = (value: string): string => {
    return (
      TRANSPORTATION_MAPPINGS[value as keyof typeof TRANSPORTATION_MAPPINGS] ||
      value
    );
  };

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

    return {
      total,
      hasData: total > 0,
    };
  }, [data]);

  // If no valid data, show empty state
  if (!processedData.hasData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          No valid transportation priority data available
        </p>
      </div>
    );
  }

  return (
    <BasePieChart
      data={data}
      field="Q645"
      title="Public Transportation Priority"
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid transportation priority data available"
      customColors={AGREEMENT_SCALE.map((item) => item.color)}
      radius={["40%", "70%"]}
      showLegend={true}
      legendPosition="left"
      tooltipFormatter={(params: any) => {
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
      }}
      graphId={graphId}
    />
  );
};
