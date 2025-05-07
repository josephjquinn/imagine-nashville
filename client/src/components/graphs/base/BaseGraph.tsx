import React, { useEffect, useRef, useMemo } from "react";
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
import { useIsMobile } from "@/hooks/useIsMobile";

interface BaseGraphProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  graphId: string;
  title?: string;
  subtitle?: string;
  emptyStateMessage?: string;
}

export const BaseGraph: React.FC<BaseGraphProps> = ({
  option,
  style,
  className,
  graphId,
  title,
  subtitle,
  emptyStateMessage = "No valid data available",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { addGraph, removeGraph } = usePDF();
  const isMobile = useIsMobile();
  console.log("BaseGraph - isMobile:", isMobile);
  console.log("BaseGraph - incoming option.legend:", option.legend);

  // Standardized title and subtitle styles
  const TITLE_STYLE = {
    fontSize: isMobile ? 14 : 18,
    fontWeight: "bold" as const,
  };

  const SUBTITLE_STYLE = {
    fontSize: isMobile ? 11 : 14,
    color: "#666",
  };

  // Check if there's any data to display
  const hasData = useMemo(() => {
    if (!option.series) return false;

    if (Array.isArray(option.series)) {
      return option.series.some((series) => {
        if (!series.data || !Array.isArray(series.data)) return false;

        // Check if there's any non-zero data
        return series.data.some((item) => {
          if (typeof item === "number") {
            return item !== 0;
          }
          if (typeof item === "object" && item !== null) {
            return item.value !== 0;
          }
          return false;
        });
      });
    }

    return false;
  }, [option]);

  // Merge the provided options with standardized title and subtitle
  const mergedOption = useMemo(() => {
    const newOption = { ...option };

    // Handle title and subtitle if provided
    if (title || subtitle) {
      // Handle both single title and array of titles
      if (Array.isArray(newOption.title)) {
        newOption.title = [
          {
            text: title || newOption.title[0]?.text || "",
            left: "center",
            top: isMobile ? 5 : 0,
            textStyle: TITLE_STYLE,
          },
          {
            text: subtitle || newOption.title[1]?.text || "",
            left: "center",
            top: isMobile ? 20 : 25,
            textStyle: SUBTITLE_STYLE,
          },
        ];
      } else {
        newOption.title = {
          text: title || newOption.title?.text || "",
          left: "center",
          top: isMobile ? 5 : 0,
          textStyle: TITLE_STYLE,
          subtext: subtitle || newOption.title?.subtext || "",
          subtextStyle: SUBTITLE_STYLE,
        };
      }
    }

    // Adjust grid and margins for mobile
    if (isMobile) {
      // Remove legend completely on mobile
      newOption.legend = { show: false };

      // Adjust axis label font size if present
      if (newOption.xAxis) {
        if (Array.isArray(newOption.xAxis)) {
          newOption.xAxis = newOption.xAxis.map((axis) => ({
            ...axis,
            axisLabel: {
              ...axis.axisLabel,
              fontSize: 10,
            },
          }));
        } else {
          newOption.xAxis = {
            ...newOption.xAxis,
            axisLabel: {
              ...newOption.xAxis?.axisLabel,
              fontSize: 10,
            },
          };
        }
      }

      if (newOption.yAxis) {
        if (Array.isArray(newOption.yAxis)) {
          newOption.yAxis = newOption.yAxis.map((axis) => ({
            ...axis,
            axisLabel: {
              ...axis.axisLabel,
              fontSize: 10,
            },
          }));
        } else {
          newOption.yAxis = {
            ...newOption.yAxis,
            axisLabel: {
              ...newOption.yAxis?.axisLabel,
              fontSize: 10,
            },
          };
        }
      }
    }

    return newOption;
  }, [option, title, subtitle, isMobile]);

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
      console.log(
        "BaseGraph - setting option with legend:",
        mergedOption.legend
      );
      chartInstance.current.setOption(mergedOption);
    }
  }, [mergedOption]);

  const handleDownload = (backgroundColor: string = "transparent") => {
    if (chartInstance.current) {
      // Get the chart canvas
      const canvas = chartInstance.current.getRenderedCanvas();

      // Create a new canvas with top padding only
      const paddedCanvas = document.createElement("canvas");
      const topPadding = 20;
      paddedCanvas.width = canvas.width;
      paddedCanvas.height = canvas.height + topPadding;

      // Get the context and fill with background color
      const ctx = paddedCanvas.getContext("2d");
      if (ctx) {
        // Fill with background color
        ctx.fillStyle =
          backgroundColor === "transparent" ? "rgba(0,0,0,0)" : backgroundColor;
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

        // Draw the original chart with top padding only
        ctx.drawImage(canvas, 0, topPadding);
      }

      // Convert to data URL
      const dataUrl = paddedCanvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `${graphId}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: isMobile ? "240px" : "400px",
          ...style,
        }}
        className={className}
      />
      <div className="absolute -top-1 -right-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "icon" : "sm"}
              className={`bg-background/80 hover:bg-background flex items-center gap-1.5 ${
                isMobile ? "h-5 w-5 p-0" : ""
              }`}
              title="Download as PNG"
            >
              <Download className={isMobile ? "h-2 w-2" : "h-4 w-4"} />
              {!isMobile && <ChevronDown className="h-3 w-3" />}
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
