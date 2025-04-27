import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

interface SurveyData {
  Q987?: string;
  [key: string]: any;
}

interface HouseholdIncomeChartProps {
  data: SurveyData[];
  graphId: string;
}

export const HouseholdIncomeChart: React.FC<HouseholdIncomeChartProps> = ({
  data,
  graphId,
}) => {
  const processedData = useMemo(() => {
    const categories = {
      "1": "Under $15,000",
      "2": "$15,000-$24,999",
      "3": "$25,000-$49,999",
      "4": "$50,000-$99,999",
      "5": "$100,000-$149,999",
      "6": "$150,000-$199,999",
      "7": "$200,000+",
      "8": "Prefer Not to Answer",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.Q987;
      if (category && counts[category] !== undefined) {
        counts[category]++;
      }
    });

    return {
      labels: Object.values(categories),
      values: Object.keys(categories).map((key) => counts[key]),
    };
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: "Household Income",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: processedData.labels,
      name: "Income Range",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      name: "Number of Responses",
    },
    series: [
      {
        type: "bar",
        data: processedData.values,
        itemStyle: {
          color: "#4f46e5",
        },
        label: {
          show: true,
          position: "top",
        },
      },
    ],
    grid: {
      containLabel: true,
      left: "3%",
      right: "4%",
      bottom: "15%",
    },
  };

  return <BaseGraph option={option} graphId={graphId} />;
};
