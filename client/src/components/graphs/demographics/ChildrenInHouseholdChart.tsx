import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface ChildrenInHouseholdChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const ChildrenInHouseholdChart: React.FC<
  ChildrenInHouseholdChartProps
> = ({ data, graphId }) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "No Children",
      "2": "Has Children",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q920"
      title="Children in Household"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
