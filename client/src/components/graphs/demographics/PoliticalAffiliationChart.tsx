import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface PoliticalAffiliationChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const PoliticalAffiliationChart: React.FC<
  PoliticalAffiliationChartProps
> = ({ data, graphId }) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Republican",
      "2": "Democrat",
      "3": "Independent",
      "4": "Something Else",
      "5": "Prefer Not to Answer",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q955"
      title="Political Affiliation"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
