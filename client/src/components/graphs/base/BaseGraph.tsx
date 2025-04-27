import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { usePDF } from "@/contexts/PDFContext";

interface BaseGraphProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  graphId: string;
}

export const BaseGraph: React.FC<BaseGraphProps> = ({
  option,
  style,
  className,
  graphId,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { addGraph, removeGraph, downloadPDF } = usePDF();

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      addGraph(graphId, chartRef.current);
    }

    return () => {
      chartInstance.current?.dispose();
      removeGraph(graphId);
    };
  }, [graphId, addGraph, removeGraph]);

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
        backgroundColor: 'transparent'
      });
      
      const link = document.createElement('a');
      link.download = `${graphId}.png`;
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
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          className="bg-background/80 hover:bg-background"
          title="Download as PNG"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={downloadPDF}
          className="bg-background/80 hover:bg-background"
          title="Download all graphs as PDF"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
