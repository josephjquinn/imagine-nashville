import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

const USAGE_MAPPINGS = {
  "1": "Don't Use",
  "2": "Few Times/Year",
  "3": "Once/Month",
  "4": "Once/Week+",
};

interface PublicTransportationChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const PublicTransportationChart: React.FC<
  PublicTransportationChartProps
> = ({ data, graphId }) => {
  const getAnswerText = (value: string): string => {
    return USAGE_MAPPINGS[value as keyof typeof USAGE_MAPPINGS] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q918"
      title="Public Transportation Usage"
      getAnswerText={getAnswerText}
      emptyStateMessage="No valid data available for Public Transportation Usage"
      graphId={graphId}
      radius={["40%", "70%"]}
      showLegend={true}
      legendPosition="left"
    />
  );
};
