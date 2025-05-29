
import React from "react";
import {
  ChartContainer as Chart,
  Line,
  Bar,
  Pie,
} from "@/components/ui/chart";

interface ChartWrapperProps {
  data?: any[]; // Make data optional
  color?: string;
  children: React.ReactElement;
}

const ChartWrapper = ({ data = [], color, children }: ChartWrapperProps) => {
  // Create configuration compatible with the Chart component
  const chartConfig = {
    // We need to create a structure that matches ChartConfig type
    // Each key in the config object needs to follow the structure in ChartConfig
    datasets: {
      label: "Dataset",
      theme: {
        light: color || "#6366f1",
        dark: color || "#6366f1",
      },
    },
  };

  // Pass data using the children React elements instead of via the config
  // This avoids type issues with the chartConfig object
  return (
    <Chart config={chartConfig}>
      {children}
    </Chart>
  );
};

export default ChartWrapper;
