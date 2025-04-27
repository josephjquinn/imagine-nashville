import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { usePDF } from "@/contexts/PDFContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { addGraph, removeGraph } = usePDF();

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

  const handleDownload = (backgroundColor: string = "transparent") => {
    if (chartInstance.current) {
      // Get the chart canvas
      const canvas = chartInstance.current.getRenderedCanvas();
      
      // Create a new canvas with top padding only
      const paddedCanvas = document.createElement('canvas');
      const topPadding = 20;
      paddedCanvas.width = canvas.width;
      paddedCanvas.height = canvas.height + topPadding;
      
      // Get the context and fill with background color
      const ctx = paddedCanvas.getContext('2d');
      if (ctx) {
        // Fill with background color
        ctx.fillStyle = backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : backgroundColor;
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
        
        // Draw the original chart with top padding only
        ctx.drawImage(canvas, 0, topPadding);
      }
      
      // Convert to data URL
      const dataUrl = paddedCanvas.toDataURL('image/png');
      
      const link = document.createElement("a");
      link.download = `${graphId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px", ...style }}
        className={className}
      />
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 hover:bg-background flex items-center gap-1.5"
              title="Download as PNG"
            >
              <Download className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleDownload("transparent")}>
              Download with Transparent Background
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload("#ffffff")}>
              Download with White Background
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
