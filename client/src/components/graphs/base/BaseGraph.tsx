import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

  const handleDownload = () => {
    if (chartInstance.current) {
      const dataUrl = chartInstance.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      
      const link = document.createElement('a');
      link.download = 'graph.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px", ...style }}
        className={className}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};
