import React from "react";
import { BasePieChart } from "./BasePieChart";
import { SurveyResponse } from "../../api/survey";
import { getAnswerText } from "../../utils/surveyDecoder";

interface EthnicityPieChartProps {
  data: SurveyResponse[];
  title?: string;
}

export const EthnicityPieChart: React.FC<EthnicityPieChartProps> = ({
  data,
  title = "Ethnicity Distribution",
}) => {
  return (
    <BasePieChart
      data={data}
      field="ETHNICITY"
      title={title}
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid data available for Ethnicity Distribution"
    />
  );
};
