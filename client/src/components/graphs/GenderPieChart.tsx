import React from "react";
import { BasePieChart } from "./BasePieChart";
import { SurveyResponse } from "../../api/survey";
import { getAnswerText } from "../../utils/surveyDecoder";

interface GenderPieChartProps {
  data: SurveyResponse[];
  title?: string;
}

export const GenderPieChart: React.FC<GenderPieChartProps> = ({
  data,
  title = "Gender Distribution",
}) => {
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
