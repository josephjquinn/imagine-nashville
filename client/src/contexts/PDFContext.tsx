import React, { createContext, useContext, useState, useCallback } from "react";
import jsPDF from "jspdf";
import * as echarts from "echarts";

interface PDFContextType {
  addGraph: (graphId: string, element: HTMLElement) => void;
  removeGraph: (graphId: string) => void;
  downloadPDF: () => Promise<void>;
  graphs: Map<string, HTMLElement>;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

// Properties that might contain color values
const colorProperties = [
  "backgroundColor",
  "color",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "columnRuleColor",
];

// Function to convert oklch to rgb
const convertOklchToRgb = (element: HTMLElement) => {
  const originalStyles = new Map<HTMLElement, Map<string, string>>();

  const processElement = (el: HTMLElement) => {
    const computedStyle = window.getComputedStyle(el);
    const elementStyles = new Map<string, string>();

    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value.includes("oklch")) {
        // Store original value
        elementStyles.set(prop, value);
        // Set temporary RGB value
        (el as any).style[prop] = "rgb(255, 255, 255)";
      }
    });

    if (elementStyles.size > 0) {
      originalStyles.set(el, elementStyles);
    }
  };

  // Process the element and all its children
  processElement(element);
  element
    .querySelectorAll("*")
    .forEach((el) => processElement(el as HTMLElement));

  return originalStyles;
};

// Function to restore original colors
const restoreOriginalColors = (
  originalStyles: Map<HTMLElement, Map<string, string>>
) => {
  originalStyles.forEach((styles, element) => {
    styles.forEach((value, prop) => {
      (element as any).style[prop] = value;
    });
  });
};

export const PDFProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [graphs, setGraphs] = useState<Map<string, HTMLElement>>(new Map());

  const addGraph = useCallback((graphId: string, element: HTMLElement) => {
    setGraphs((prev) => new Map(prev).set(graphId, element));
  }, []);

  const removeGraph = useCallback((graphId: string) => {
    setGraphs((prev) => {
      const newGraphs = new Map(prev);
      newGraphs.delete(graphId);
      return newGraphs;
    });
  }, []);

  const downloadPDF = useCallback(async () => {
    if (graphs.size === 0) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    let currentPage = 1;
    let currentY = margin;

    for (const [graphId, element] of graphs) {
      // Get the ECharts instance
      const chartInstance = echarts.getInstanceByDom(element);
      if (!chartInstance) continue;

      // Get the canvas data URL directly from ECharts
      const dataUrl = chartInstance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Create an image element to get the dimensions
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = dataUrl;
      });

      const imgWidth = contentWidth;
      const imgHeight = (img.height * contentWidth) / img.width;

      // Check if we need a new page
      if (currentY + imgHeight > pageHeight - margin) {
        pdf.addPage();
        currentPage++;
        currentY = margin;
      }

      pdf.addImage(dataUrl, "PNG", margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10; // Add some spacing between graphs
    }

    pdf.save("nashville-survey-graphs.pdf");
  }, [graphs]);

  return (
    <PDFContext.Provider value={{ addGraph, removeGraph, downloadPDF, graphs }}>
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error("usePDF must be used within a PDFProvider");
  }
  return context;
};
