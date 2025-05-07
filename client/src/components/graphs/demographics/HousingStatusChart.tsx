import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface HousingStatusChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const HousingStatusChart: React.FC<HousingStatusChartProps> = ({
  data,
  graphId,
}) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Own",
      "2": "Rent",
      "3": "Other",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q915"
      title="Housing Status"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
