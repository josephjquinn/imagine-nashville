import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import { SurveyResponse } from "@/types/survey";

const GENDER_MAPPINGS = {
  "1": "Male",
  "2": "Female",
  "3": "Non-binary",
  "4": "Prefer to self-describe",
};

interface GenderPieChartProps {
  data: SurveyResponse[];
  title?: string;
  graphId: string;
}

export const GenderPieChart: React.FC<GenderPieChartProps> = ({
  data,
  title = "Gender Distribution",
  graphId,
}) => {
  const getAnswerText = (value: string): string => {
    return GENDER_MAPPINGS[value as keyof typeof GENDER_MAPPINGS] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q105"
      title={title}
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid data available for Gender Distribution"
      graphId={graphId}
    />
  );
};
