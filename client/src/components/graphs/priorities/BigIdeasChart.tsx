import React, { useMemo } from "react";
import { BaseGraph } from "../base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/types/survey";

const BIG_IDEAS = [
  {
    value: "1",
    label:
      "Creativity, Innovation, and Entrepreneurship Supercenter: In this future Nashville is dedicated to creative new ideas and innovations that make lives and our world better. This future focuses on creativity hubs, startup incubators and accelerators that create and drive new business and work opportunities at every level. Our great universities and industries collaborate to drive tech advancements and cultivate the best talent. Resources, funding, and mentoring focus on helping people fulfill their potential.",
    shortLabel: "Creativity, Innovation, and Entrepreneurship Supercenter",
  },
  {
    value: "2",
    label:
      "Music and Arts Epicenter: In this future Nashville fuels its amazing creative energy and reputation even more with state-of-the-art performance venues, recording studios, and creative spaces for all kinds of artists. Grants, scholarships, and educational programs nurture local talent and attract great artists. Local, national, and globally focused music festivals, exhibitions, and cultural events make Nashville's treasure accessible to all.",
    shortLabel: "Music and Arts Epicenter",
  },
  {
    value: "3",
    label:
      "Nashville's Neighborhoods are its Stars: In this future the focus is on the neighborhoods of Nashville because that is where the people that make this city great live. Each neighborhood cultivates the unique and special character and cultures that make it great, and the City works to ensure every neighborhood has the critical components it needs to be successful (quality schools, parks, mix of housing and affordability, public transportation access, walkable neighborhoods, community centers and more).",
    shortLabel: "Nashville's Neighborhoods are its Stars",
  },
  {
    value: "4",
    label:
      "Nashville is Home…The Place of Inclusion and Belonging: Just like music is the celebration of sounds and rhythms coming together, Nashville is the rich celebration of the many voices, cultures, and people coming together to make beautiful living. Building on the legacy that led civil rights decades ago, Nashville continues to challenge and stretch itself and this place to make everyone here (longtime residents, immigrants, minorities, newcomers) feel welcomed, supported, and like they belong.",
    shortLabel: "Nashville is Home-The Place of Inclusion and Belonging",
  },
  {
    value: "5",
    label:
      "The Connected City: This future recognizes that human thriving depends on being connected—connected to each other and the things we love. This future focuses on making sure every person in Nashville is far better connected to others, their neighborhoods, their city and all the marvelous opportunities the City has to offer through state-of-the art mass transit, better roadways, and greenways, safe and walkable/bikeable neighborhoods and digital inclusion that ensures everyone has access to high-quality opportunities.",
    shortLabel: "The Connected City",
  },
];

interface BigIdeasChartProps {
  data: SurveyResponse[];
  graphId: string;
}

export const BigIdeasChart: React.FC<BigIdeasChartProps> = ({
  data,
  graphId,
}) => {
  const { processedData } = useMemo(() => {
    const ideaCounts = new Map<string, { top: number; second: number }>();
    BIG_IDEAS.forEach((idea) => {
      ideaCounts.set(idea.value, { top: 0, second: 0 });
    });
    let validResponses = 0;
    data.forEach((response) => {
      const topChoice = response["Q810"];
      const secondChoice = response["Q815"];
      if (topChoice || secondChoice) {
        validResponses++;
      }
      if (topChoice && topChoice !== "") {
        const current = ideaCounts.get(topChoice) || { top: 0, second: 0 };
        ideaCounts.set(topChoice, { ...current, top: current.top + 1 });
      }
      if (secondChoice && secondChoice !== "") {
        const current = ideaCounts.get(secondChoice) || { top: 0, second: 0 };
        ideaCounts.set(secondChoice, {
          ...current,
          second: current.second + 1,
        });
      }
    });
    const results = BIG_IDEAS.map((idea) => {
      const counts = ideaCounts.get(idea.value) || { top: 0, second: 0 };
      return {
        name: idea.label,
        shortName: idea.shortLabel,
        topPercentage: (counts.top / validResponses) * 100,
        secondPercentage: (counts.second / validResponses) * 100,
        total: counts.top + counts.second,
        totalPercentage: ((counts.top + counts.second) / validResponses) * 100,
        rawTop: counts.top,
        rawSecond: counts.second,
      };
    });
    // Sort by total percentage ascending (biggest bars on top)
    return {
      processedData: results.sort(
        (a, b) => a.totalPercentage - b.totalPercentage
      ),
      totalResponses: validResponses,
    };
  }, [data]);

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const data = params[0].data;
        return `
          <div style="max-width: 350px; white-space: normal; word-wrap: break-word;">
            <div style="font-weight: bold; margin-bottom: 8px;">${
              data.fullName
            }</div>
            <div style="margin: 4px 0;">Top Choice: ${
              data.rawTop
            } (${data.topPercentage.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Second Choice: ${
              data.rawSecond
            } (${data.secondPercentage.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Total: ${
              data.total
            } (${data.totalPercentage.toFixed(1)}%)</div>
          </div>
        `;
      },
    },
    legend: {
      data: ["Top", "Second"],
      bottom: 0,
      left: "42%",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "Percentage of Respondents",
      nameLocation: "middle",
      nameGap: 30,
      max: 100,
      axisLabel: {
        formatter: "{value}%",
      },
    },
    yAxis: {
      type: "category",
      data: processedData.map((item) => item.shortName),
      axisLabel: {
        width: 350,
        overflow: "break",
        interval: 0,
        align: "right",
      },
    },
    series: [
      {
        name: "Top",
        type: "bar",
        stack: "total",
        itemStyle: {
          color: "#dc2626", // red-600 for top choice
        },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.topPercentage > 5
              ? `${Math.round(params.data.topPercentage)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.topPercentage,
          name: item.shortName,
          fullName: item.name,
          rawTop: item.rawTop,
          rawSecond: item.rawSecond,
          topPercentage: item.topPercentage,
          secondPercentage: item.secondPercentage,
          total: item.total,
          totalPercentage: item.totalPercentage,
        })),
      },
      {
        name: "Second",
        type: "bar",
        stack: "total",
        itemStyle: {
          color: "#f87171", // red-400 for second choice
        },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.secondPercentage > 5
              ? `${Math.round(params.data.secondPercentage)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.secondPercentage,
          name: item.shortName,
          fullName: item.name,
          rawTop: item.rawTop,
          rawSecond: item.rawSecond,
          topPercentage: item.topPercentage,
          secondPercentage: item.secondPercentage,
          total: item.total,
          totalPercentage: item.totalPercentage,
        })),
      },
      {
        name: "Total",
        type: "bar",
        stack: "total",
        itemStyle: {
          color: "none",
          borderWidth: 0,
        },
        label: {
          show: true,
          position: "right",
          formatter: function (params: any) {
            return `${Math.round(params.data.totalPercentage)}%`;
          },
          color: "#666",
          distance: 5,
        },
        data: processedData.map((item) => ({
          value: 0,
          name: item.shortName,
          fullName: item.name,
          rawTop: item.rawTop,
          rawSecond: item.rawSecond,
          topPercentage: item.topPercentage,
          secondPercentage: item.secondPercentage,
          total: item.total,
          totalPercentage: item.totalPercentage,
        })),
      },
    ],
  };

  return (
    <BaseGraph
      option={option}
      graphId={graphId}
      title="Nashville's Big Ideas for the Future"
      subtitle="% Selected as Top 2 Ideas"
    />
  );
};
