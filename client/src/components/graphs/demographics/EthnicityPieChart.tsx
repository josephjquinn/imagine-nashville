import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import { SurveyResponse } from "@/types/survey";

const ETHNICITY_MAPPINGS = {
  "1": "White",
  "2": "Black or African American",
  "3": "Hispanic or Latino",
  "4": "Asian",
  "5": "Native American or Alaska Native",
  "6": "Native Hawaiian or Pacific Islander",
  "7": "Other",
  "8": "Prefer not to say",
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
      field="ETHNICITY"
      title={title}
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid data available for Ethnicity Distribution"
      graphId={graphId}
    />
  );
};
