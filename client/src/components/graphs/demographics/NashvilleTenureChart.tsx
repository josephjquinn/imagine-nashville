import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";

interface SurveyData {
  Q900?: string;
  HQ901?: string;
  [key: string]: any;
}

interface NashvilleTenureChartProps {
  data: SurveyData[];
  graphId: string;
}

export const NashvilleTenureChart: React.FC<NashvilleTenureChartProps> = ({
  data,
  graphId,
}) => {
  const computedTenureData = useMemo(() => {
    const categories = {
      "1": "1 year or less",
      "2": "2-4 years",
      "3": "5-9 years",
      "4": "10-14 years",
      "5": "15-24 years",
      "6": "25+ years",
    };

    const counts: { [key: string]: number } = {};
    Object.keys(categories).forEach((key) => (counts[key] = 0));

    data.forEach((item) => {
      const category = item.HQ901;
      if (category && counts[category] !== undefined) {
        counts[category]++;
      }
    });

    return Object.entries(categories).map(([key, label]) => ({
      name: label,
      value: counts[key],
    }));
  }, [data]);

  const rawYearsData = useMemo(() => {
    const years = data
      .map((item) => parseInt(item.Q900 || "0"))
      .filter((year) => !isNaN(year) && year > 0);

    // Create bins for the histogram
    const bins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const counts = new Array(bins.length - 1).fill(0);

    years.forEach((year) => {
      for (let i = 0; i < bins.length - 1; i++) {
        if (year >= bins[i] && year < bins[i + 1]) {
          counts[i]++;
          break;
        }
      }
    });

    return {
      bins: bins.slice(0, -1).map((bin, i) => `${bin}-${bins[i + 1]}`),
      counts,
    };
  }, [data]);

  const computedOption: EChartsOption = {
    title: {
      text: "Nashville Tenure (Categories)",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      type: "scroll",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{d}%",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        data: computedTenureData,
      },
    ],
  };

  const rawOption: EChartsOption = {
    title: {
      text: "Years Living in Nashville",
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
      data: rawYearsData.bins,
      name: "Years",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Number of Responses",
      position: "left",
      offset: 0,
    },
    series: [
      {
        type: "bar",
        data: rawYearsData.counts,
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
      left: "10%",
      right: "10%",
      bottom: "5%",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <BaseGraph
        option={computedOption}
        graphId={graphId}
        style={{ height: "400px" }}
      />
      <BaseGraph
        option={rawOption}
        graphId={graphId}
        style={{ height: "400px" }}
      />
    </div>
  );
};
