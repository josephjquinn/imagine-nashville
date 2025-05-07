import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface LivingAreaChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const LivingAreaChart: React.FC<LivingAreaChartProps> = ({
  data,
  graphId,
}) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Urban/City Area",
      "2": "Suburban Area",
      "3": "Small Town/City",
      "4": "Rural Area",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q905"
      title="Living Area Type"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
