import React from "react";
import type { EChartsOption } from "echarts";
import { BaseGraph } from "./BaseGraph";

interface BaseTableProps {
  title?: string;
  subtitle?: string;
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((index: number) => string);
  showLegend?: boolean;
  legendItems?: {
    label: string;
    color?: string;
    icon?: React.ReactNode;
  }[];
  footer?: React.ReactNode;
}

export const BaseTable: React.FC<BaseTableProps> = ({
  title,
  subtitle,
  headers,
  rows,
  className = "",
  headerClassName = "",
  rowClassName = "",
  showLegend = false,
  legendItems = [],
  footer,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

      <div className="mt-4 overflow-x-auto">
        <table className={`min-w-full border-collapse ${className}`}>
          <thead>
            <tr className={headerClassName}>
              {headers.map((header, index) => (
                <th key={index} className="border-b-2 border-gray-200 p-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  typeof rowClassName === "function"
                    ? rowClassName(rowIndex)
                    : rowClassName
                }
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-3 px-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showLegend && legendItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {item.icon || (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

interface BasePrioChartProps {
  option: EChartsOption;
  title?: string;
  subtitle?: string;
  style?: React.CSSProperties;
  className?: string;
  showLegend?: boolean;
  legendItems?: Array<{
    label: string;
    color: string;
    icon?: React.ReactNode;
  }>;
  emptyStateMessage?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export const BasePrioChart: React.FC<BasePrioChartProps> = ({
  option,
  title,
  subtitle,
  style,
  className,
  showLegend = false,
  legendItems = [],
  emptyStateMessage = "No data available",
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        <div className="flex items-center justify-center h-64 text-red-500">
          <p>{error.message || "An error occurred while loading the chart"}</p>
        </div>
      </div>
    );
  }

  const hasData = Array.isArray(option.series)
    ? option.series.length > 0
    : option.series !== undefined;

  if (!hasData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>{emptyStateMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

      <BaseGraph
        option={option}
        style={style}
        className={className}
        graphId="base-table"
      />

      {showLegend && legendItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {item.icon || (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
