import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface ReligiousAffiliationChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const ReligiousAffiliationChart: React.FC<
  ReligiousAffiliationChartProps
> = ({ data, graphId }) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Protestant",
      "2": "Catholic",
      "3": "Jewish",
      "4": "Muslim",
      "5": "Hindu",
      "6": "Buddhist",
      "7": "Other",
      "8": "None",
      "9": "Not Sure",
      "10": "Prefer Not to Answer",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q990"
      title="Religious Affiliation"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
