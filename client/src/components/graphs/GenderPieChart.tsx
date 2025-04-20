import React from "react";
import { BasePieChart } from "./BasePieChart";
import { SurveyResponse } from "../../api/survey";

const GENDER_MAPPINGS = {
  "1": "Male",
  "2": "Female",
  "3": "Non-binary",
  "4": "Prefer to self-describe",
};

interface GenderPieChartProps {
  data: SurveyResponse[];
  title?: string;
}

export const GenderPieChart: React.FC<GenderPieChartProps> = ({
  data,
  title = "Gender Distribution",
}) => {
  const getAnswerText = (field: string, value: string): string => {
    return GENDER_MAPPINGS[value as keyof typeof GENDER_MAPPINGS] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q105"
      title={title}
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid data available for Gender Distribution"
    />
  );
};
