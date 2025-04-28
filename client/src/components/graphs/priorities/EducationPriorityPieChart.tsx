import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import { SurveyResponse } from "@/types/survey";

const Q665_LABELS: Record<string, string> = {
  "1": "Strongly disagree",
  "2": "Somewhat disagree",
  "3": "Somewhat agree",
  "4": "Strongly agree",
};

interface EducationPriorityPieChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const EducationPriorityPieChart: React.FC<
  EducationPriorityPieChartProps
> = ({ data, graphId }) => {
  return (
    <BasePieChart
      data={data}
      field="Q665"
      title="Agreement: Investing in Public Education is a Priority"
      getAnswerText={(value) => Q665_LABELS[value] || value}
      showLegend={true}
      legendPosition="right"
      tooltipFormatter={(params) => {
        const value = params.value as number;
        return `${params.name}: ${value}%`;
      }}
      graphId={graphId}
    />
  );
};
