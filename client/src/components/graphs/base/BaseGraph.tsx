import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

interface BaseGraphProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
}

export const BaseGraph: React.FC<BaseGraphProps> = ({
  option,
  style,
  className,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }
  }, [option]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "400px", ...style }}
      className={className}
    />
  );
};
