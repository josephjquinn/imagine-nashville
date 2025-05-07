import React from "react";
import { BasePieChart } from "../base/BasePieChart";
import type { SurveyResponse } from "@/types/survey";

interface EmploymentStatusChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const EmploymentStatusChart: React.FC<EmploymentStatusChartProps> = ({
  data,
  graphId,
}) => {
  const getAnswerText = (value: string) => {
    const categories = {
      "1": "Full-time",
      "2": "Part-time",
      "3": "Not Employed",
      "4": "Prefer Not to Answer",
    };
    return categories[value as keyof typeof categories] || value;
  };

  return (
    <BasePieChart
      data={data}
      field="Q940"
      title="Employment Status"
      getAnswerText={getAnswerText}
      graphId={graphId}
      legendPosition="left"
    />
  );
};
