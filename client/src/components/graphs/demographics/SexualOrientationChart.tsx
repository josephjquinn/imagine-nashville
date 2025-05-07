import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface SexualOrientationChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const SexualOrientationChart: React.FC<SexualOrientationChartProps> = ({
  data,
  graphId,
}) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Straight/Heterosexual",
      "2": "Gay/Lesbian",
      "3": "Bisexual",
      "4": "Other",
      "5": "Not Sure",
      "6": "Prefer Not to Answer",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q980"
      title="Sexual Orientation"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
