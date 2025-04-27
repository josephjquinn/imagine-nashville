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
    console.log(`Adding graph: ${graphId}`);
    setGraphs((prev) => new Map(prev).set(graphId, element));
  }, []);

  const removeGraph = useCallback((graphId: string) => {
    console.log(`Removing graph: ${graphId}`);
    setGraphs((prev) => {
      const newGraphs = new Map(prev);
      newGraphs.delete(graphId);
      return newGraphs;
    });
  }, []);

  const downloadPDF = useCallback(async () => {
    if (graphs.size === 0) {
      console.warn("No graphs available for PDF generation");
      return;
    }

    console.log(`Starting PDF generation with ${graphs.size} graphs`);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    let currentPage = 1;
    let currentY = margin;
    let successfulCaptures = 0;

    for (const [graphId, element] of graphs) {
      try {
        console.log(`Processing graph: ${graphId}`);

        // Get the ECharts instance
        const chartInstance = echarts.getInstanceByDom(element);
        if (!chartInstance) {
          console.error(`No ECharts instance found for graph: ${graphId}`);
          continue;
        }

        // Ensure the chart is rendered
        chartInstance.resize();

        // Get the canvas data URL directly from ECharts
        const dataUrl = chartInstance.getDataURL({
          type: "png",
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });

        if (!dataUrl) {
          console.error(`Failed to get data URL for graph: ${graphId}`);
          continue;
        }

        // Create an image element to get the dimensions
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () =>
            reject(new Error(`Failed to load image for graph: ${graphId}`));
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
        successfulCaptures++;

        console.log(`Successfully added graph to PDF: ${graphId}`);
      } catch (error) {
        console.error(`Error processing graph ${graphId}:`, error);
      }
    }

    if (successfulCaptures === 0) {
      console.error("No graphs were successfully captured for the PDF");
      return;
    }

    console.log(
      `PDF generation complete. Successfully captured ${successfulCaptures} out of ${graphs.size} graphs`
    );
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
