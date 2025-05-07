import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import { SurveyResponse } from "@/types/survey";

const ETHNICITY_MAPPINGS = {
  "1": "Hispanic or Latino",
  "2": "Kurdish",
  "3": "White",
  "4": "African American or Black",
  "5": "Asian American and Pacific Islander",
  "6": "Other",
};

interface EthnicityPieChartProps {
  data: SurveyResponse[];
  title?: string;
  graphId: string;
}

export const EthnicityPieChart: React.FC<EthnicityPieChartProps> = ({
  data,
  title = "Ethnicity Distribution",
  graphId,
}) => {
  const getAnswerText = (value: string): string => {
    return (
      ETHNICITY_MAPPINGS[value as keyof typeof ETHNICITY_MAPPINGS] || value
    );
  };

  return (
    <BasePieChart
      data={data}
      field="HQ130"
      title={title}
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid data available for Ethnicity Distribution"
      graphId={graphId}
    />
  );
};
