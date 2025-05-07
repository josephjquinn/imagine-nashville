import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface MaritalStatusChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const MaritalStatusChart: React.FC<MaritalStatusChartProps> = ({
  data,
  graphId,
}) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Married",
      "2": "Separated",
      "3": "Divorced",
      "4": "Single",
      "5": "Widowed",
      "6": "Engaged",
      "7": "Living Together",
      "8": "Prefer Not to Answer",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q930"
      title="Marital Status"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
