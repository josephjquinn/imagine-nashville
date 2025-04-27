import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface SurveyDataItem {
  zip_code?: string;
  [key: string]: any;
}

interface NashvilleZipCodeMapProps {
  data: SurveyDataItem[];
}

interface MapDataItem {
  name: string;
  value: number;
}

const NashvilleZipCodeMap: React.FC<NashvilleZipCodeMapProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts instance
    chartInstance.current = echarts.init(chartRef.current);

    // Show loading state
    chartInstance.current.showLoading();

    // Load the GeoJSON data
    fetch("/geo/Zip_Code_Boundaries_Vw_-7004047684671741122.geojson")
      .then((response) => response.json())
      .then((geoJson) => {
        // Hide loading state
        if (chartInstance.current) {
          chartInstance.current.hideLoading();
        }

        // Register the map data
        echarts.registerMap("nashville", geoJson);

        // Process survey data to get counts by zip code
        const zipCodeData = data.reduce((acc, item) => {
          const zip = item.zip_code?.toString().trim();
          if (zip && zip.length > 0) {
            acc[zip] = (acc[zip] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        // Convert to format needed by ECharts
        const seriesData: MapDataItem[] = Object.entries(zipCodeData)
          .map(([name, value]) => ({
            name,
            value: Number(value),
          }))
          .filter((item) => !isNaN(item.value));

        const maxValue = Math.max(...Object.values(zipCodeData));

        // Set chart options
        const option: echarts.EChartsOption = {
          title: {
            text: "Survey Responses by Zip Code",
            subtext: "Nashville, TN",
            left: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>Responses: {c}",
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          visualMap: {
            type: "continuous",
            min: 0,
            max: maxValue,
            text: ["High", "Low"],
            realtime: false,
            calculable: true,
            inRange: {
              color: ["#e0f3f8", "#74add1", "#4575b4", "#313695"],
            },
            outOfRange: {
              color: "#e0f3f8",
            },
          },
          series: [
            {
              name: "Survey Responses",
              type: "map",
              map: "nashville",
              roam: true,
              zoom: 1.2,
              emphasis: {
                label: {
                  show: true,
                },
              },
              data: seriesData,
            },
          ],
        };

        if (chartInstance.current) {
          chartInstance.current.setOption(option);
        }
      })
      .catch((error) => {
        console.error("Error loading map data:", error);
        if (chartInstance.current) {
          chartInstance.current.hideLoading();
        }
      });

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "600px",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};

export default NashvilleZipCodeMap;
