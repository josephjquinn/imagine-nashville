import React from "react";
import { BasePieChart } from "./base/BasePieChart";
import { SurveyResponse } from "@/api/public_survey";

const Q665_LABELS: Record<string, string> = {
  "1": "Strongly disagree",
  "2": "Somewhat disagree",
  "3": "Somewhat agree",
  "4": "Strongly agree",
};

interface EducationPriorityPieChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
}

export const EducationPriorityPieChart: React.FC<
  EducationPriorityPieChartProps
> = ({
  data,
  title = "Agreement: Investing in Public Education is a Priority",
  subtitle = "Q665",
}) => {
  return (
    <BasePieChart
      data={data}
      field="Q665"
      title={title}
      getAnswerText={(value) => Q665_LABELS[value] || "Other"}
      showLegend={true}
      legendPosition="right"
      tooltipFormatter={(params: any) => {
        const count = params.value;
        const percentage = params.percent.toFixed(1);
        return `<div><strong>${params.name}</strong><br/>Count: ${count}<br/>Percentage: ${percentage}%</div>`;
      }}
    />
  );
};
