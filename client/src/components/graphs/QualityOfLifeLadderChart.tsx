import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { SurveyResponse } from "../../api/survey";

interface QualityOfLifeLadderChartProps {
  data: SurveyResponse[];
}

const QualityOfLifeLadderChart: React.FC<QualityOfLifeLadderChartProps> = ({
  data,
}) => {
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barChartRef.current || !pieChartRef.current || !data.length) return;

    const barChart = echarts.init(barChartRef.current);
    const pieChart = echarts.init(pieChartRef.current);

    // Process the data for the bar chart
    const processBarData = () => {
      const timePoints = [
        { key: "Q200", label: "5 Years Ago" },
        { key: "Q205", label: "Today" },
        { key: "Q210", label: "5 Years From Now" },
      ];

      const averages = timePoints.map(({ key }) => {
        const validResponses = data.filter(
          (response) => response[key] !== undefined && response[key] !== null
        );
        const sum = validResponses.reduce(
          (acc, response) => acc + (Number(response[key]) || 0),
          0
        );
        return sum / (validResponses.length || 1);
      });

      const minValue = Math.min(...averages);
      const maxValue = Math.max(...averages);
      const range = maxValue - minValue;
      const yAxisMin = Math.floor(minValue - range * 0.2);
      const yAxisMax = Math.ceil(maxValue + range * 0.2);

      return {
        timePoints,
        averages,
        yAxisRange: [yAxisMin, yAxisMax],
      };
    };

    // Process the data for the pie chart
    const processPieData = () => {
      const validResponses = data.filter(
        (response) => response.HQ211 !== undefined && response.HQ211 !== null
      );

      const counts = {
        decreased: 0,
        same: 0,
        improved: 0,
      };

      validResponses.forEach((response) => {
        const value = Number(response.HQ211);
        if (value === 1) counts.decreased++;
        else if (value === 2) counts.same++;
        else if (value === 3) counts.improved++;
      });

      const total = validResponses.length;
      return [
        { value: counts.decreased, name: "Decreased" },
        { value: counts.same, name: "Same" },
        { value: counts.improved, name: "Improved" },
      ].map((item) => ({
        ...item,
        percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0",
      }));
    };

    const { timePoints, averages, yAxisRange } = processBarData();
    const pieData = processPieData();

    // Bar chart options
    const barOption: echarts.EChartsOption = {
      title: {
        text: "Quality of Life Ladder Averages",
        subtext: "Average ladder step over time",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}: ${param.value.toFixed(1)} / 10`;
        },
      },
      grid: {
        left: "8%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: timePoints.map((tp) => tp.label),
        axisLabel: {
          interval: 0,
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
        min: yAxisRange[0],
        max: yAxisRange[1],
        interval: 0.5,
        name: "Ladder Step",
        nameLocation: "middle",
        nameGap: 50,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        axisLabel: {
          formatter: (value: number) => value.toFixed(1),
          fontSize: 14,
          fontWeight: "bold",
          margin: 15,
        },
        axisLine: {
          lineStyle: {
            width: 2,
          },
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            width: 1,
          },
        },
      },
      series: [
        {
          name: "Average Ladder Step",
          type: "bar",
          data: averages.map((value) => Number(value.toFixed(1))),
          barWidth: "60%",
          barGap: "0%",
          itemStyle: {
            color: "#5470c6",
          },
          label: {
            show: true,
            position: "inside",
            distance: 15,
            formatter: (params: any) => params.value.toFixed(1),
            fontSize: 16,
            fontWeight: "bold",
            color: "#fff",
          },
        },
      ],
    };

    // Pie chart options
    const pieOption: echarts.EChartsOption = {
      title: {
        text: "Perceived Change in Quality of Life",
        subtext: "Past vs Today",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          return `${params.name}: ${params.data.percent}% (${params.value} responses)`;
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Perceived Change",
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
            formatter: "{b}: {d}%",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          data: pieData,
        },
      ],
    };

    barChart.setOption(barOption);
    pieChart.setOption(pieOption);

    const handleResize = () => {
      barChart.resize();
      pieChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      barChart.dispose();
      pieChart.dispose();
    };
  }, [data]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div
        ref={barChartRef}
        className="flex-1"
        style={{
          height: "400px",
          minHeight: "300px",
        }}
      />
      <div
        ref={pieChartRef}
        className="flex-1"
        style={{
          height: "400px",
          minHeight: "300px",
        }}
      />
    </div>
  );
};

export default QualityOfLifeLadderChart;
