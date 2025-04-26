import React, { useMemo } from "react";
import { BaseGraph } from "./base/BaseGraph";
import type { EChartsOption } from "echarts";
import { SurveyResponse } from "@/api/public_survey";

const ASSETS = [
  { key: "A", label: "Police/fire stations" },
  { key: "B", label: "Hospital" },
  { key: "C", label: "Affordable housing options" },
  { key: "D", label: "Grocery stores" },
  { key: "E", label: "Easy access to highways" },
  { key: "F", label: "Doctor/Dentist offices" },
  { key: "G", label: "Parks/recreational fields" },
  { key: "H", label: "Schools" },
  {
    key: "I",
    label: "Sidewalks with good lighting on both sides of every street",
  },
  { key: "J", label: "Parks and green spaces" },
  { key: "K", label: "Library" },
  { key: "L", label: "Bikeable and walkable throughout" },
  { key: "M", label: "Access to public transportation" },
  { key: "N", label: "My place of work" },
  { key: "O", label: "Universities/Community-Technical colleges" },
  { key: "P", label: "Entertainment/restaurants" },
  { key: "Q", label: "Small retail services" },
  { key: "R", label: "Reliable garbage and waste removal" },
  { key: "S", label: "Church, synagogue, or other place of worship" },
  {
    key: "T",
    label: "Community Center—good and safe place for youth activity",
  },
  { key: "U", label: "Easy access to airport" },
  { key: "V", label: "Senior Center" },
  { key: "W", label: "Shopping malls" },
  { key: "X", label: "Downtown Nashville" },
];

interface IdealNeighborhoodAssetsChartProps {
  data: SurveyResponse[];
  title?: string;
  subtitle?: string;
}

export const IdealNeighborhoodAssetsChart: React.FC<
  IdealNeighborhoodAssetsChartProps
> = ({
  data,
  title = "What's part of an Ideal Neighborhood:",
  subtitle = "% Selected as Important, Very Important, or Absolutely Essential",
}) => {
  const { processedData } = useMemo(() => {
    let validResponses = data.length;
    const results = ASSETS.map((asset) => {
      let counts = [0, 0, 0]; // [Important, Very Important, Absolutely Essential]
      data.forEach((response) => {
        const essential = response[`Q710_3_${asset.key}`] === "1";
        const veryImportant = response[`Q710_2_${asset.key}`] === "1";
        const important = response[`Q710_1_${asset.key}`] === "1";
        if (essential) {
          counts[2]++;
        } else if (veryImportant) {
          counts[1]++;
        } else if (important) {
          counts[0]++;
        }
      });
      const importantPct = (counts[0] / validResponses) * 100;
      const veryImportantPct = (counts[1] / validResponses) * 100;
      const essentialPct = (counts[2] / validResponses) * 100;
      return {
        name: asset.label,
        importantPct,
        veryImportantPct,
        essentialPct,
        total: counts[0] + counts[1] + counts[2],
        totalPct: ((counts[0] + counts[1] + counts[2]) / validResponses) * 100,
        rawImportant: counts[0],
        rawVeryImportant: counts[1],
        rawEssential: counts[2],
      };
    });
    return {
      processedData: results.sort((a, b) => a.totalPct - b.totalPct),
      totalResponses: validResponses,
    };
  }, [data]);

  const option: EChartsOption = {
    title: {
      text: title,
      left: "center",
      top: 0,
      textStyle: { fontSize: 20, fontWeight: "bold" },
      subtext: subtitle,
      subtextStyle: { fontSize: 14, color: "#666" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params: any) {
        const data = params[0].data;
        return `
          <div style="max-width: 350px; white-space: normal; word-wrap: break-word;">
            <div style="font-weight: bold; margin-bottom: 8px;">${
              data.name
            }</div>
            <div style="margin: 4px 0;">Important: ${
              data.rawImportant
            } (${data.importantPct.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Very Important: ${
              data.rawVeryImportant
            } (${data.veryImportantPct.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Absolutely Essential: ${
              data.rawEssential
            } (${data.essentialPct.toFixed(1)}%)</div>
            <div style="margin: 4px 0;">Total: ${
              data.total
            } (${data.totalPct.toFixed(1)}%)</div>
          </div>
        `;
      },
    },
    legend: {
      data: ["Important", "Very Important", "Absolutely Essential"],
      bottom: 0,
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
      max: 100,
      axisLabel: { formatter: "{value}%" },
    },
    yAxis: {
      type: "category",
      data: processedData.map((item) => item.name),
      axisLabel: {
        width: 300,
        overflow: "break",
        interval: 0,
        align: "right",
      },
    },
    series: [
      {
        name: "Important",
        type: "bar",
        stack: "total",
        itemStyle: { color: "#a5b4fc" },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.importantPct > 5
              ? `${Math.round(params.data.importantPct)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.importantPct,
          name: item.name,
          rawImportant: item.rawImportant,
          rawVeryImportant: item.rawVeryImportant,
          rawEssential: item.rawEssential,
          importantPct: item.importantPct,
          veryImportantPct: item.veryImportantPct,
          essentialPct: item.essentialPct,
          total: item.total,
          totalPct: item.totalPct,
        })),
      },
      {
        name: "Very Important",
        type: "bar",
        stack: "total",
        itemStyle: { color: "#6366f1" },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.veryImportantPct > 5
              ? `${Math.round(params.data.veryImportantPct)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.veryImportantPct,
          name: item.name,
          rawImportant: item.rawImportant,
          rawVeryImportant: item.rawVeryImportant,
          rawEssential: item.rawEssential,
          importantPct: item.importantPct,
          veryImportantPct: item.veryImportantPct,
          essentialPct: item.essentialPct,
          total: item.total,
          totalPct: item.totalPct,
        })),
      },
      {
        name: "Absolutely Essential",
        type: "bar",
        stack: "total",
        itemStyle: { color: "#f59e42" },
        label: {
          show: true,
          position: "inside",
          formatter: function (params: any) {
            return params.data.essentialPct > 5
              ? `${Math.round(params.data.essentialPct)}%`
              : "";
          },
          color: "#fff",
        },
        data: processedData.map((item) => ({
          value: item.essentialPct,
          name: item.name,
          rawImportant: item.rawImportant,
          rawVeryImportant: item.rawVeryImportant,
          rawEssential: item.rawEssential,
          importantPct: item.importantPct,
          veryImportantPct: item.veryImportantPct,
          essentialPct: item.essentialPct,
          total: item.total,
          totalPct: item.totalPct,
        })),
      },
      {
        name: "Total",
        type: "bar",
        stack: "total",
        itemStyle: { color: "none", borderWidth: 0 },
        label: {
          show: true,
          position: "right",
          formatter: function (params: any) {
            return `${Math.round(params.data.totalPct)}%`;
          },
          color: "#666",
          distance: 5,
        },
        data: processedData.map((item) => ({
          value: 0,
          name: item.name,
          rawImportant: item.rawImportant,
          rawVeryImportant: item.rawVeryImportant,
          rawEssential: item.rawEssential,
          importantPct: item.importantPct,
          veryImportantPct: item.veryImportantPct,
          essentialPct: item.essentialPct,
          total: item.total,
          totalPct: item.totalPct,
        })),
      },
    ],
  };

  return <BaseGraph option={option} style={{ height: "800px" }} />;
};
