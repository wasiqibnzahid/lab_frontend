import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { WeeklyAverageGrowthAfterTreatment } from "../types/types";

interface Props {
  data: WeeklyAverageGrowthAfterTreatment;
}
export default function MetricsChart({ data }: Props) {
  const config = {
    options: {
      colors: [
        "#F44336", // Red
        "#2ECC71", // Emerald green
        "#E91E63", // Light coral
        "#9C27B0", // Dark violet
        "#3F51B5", // Indigo
        "#FF9800", // Orange
        "#FFEB3B", // Canary yellow
        "#795548", // Dark brown
        "#009688", // Teal
        "#C2185B", // Medium violet red
        "#4CAF50", // Green
        "#CDDC39", // Light green (chartreuse)
        "#FFCDD2", // Pink
        "#00BCD4", // Light blue
        "#9E9E9E", // Grey
        "#DF0030", // Red (deeper shade)
        "#FFFF00", // Yellow
        "#00C7CF", // Sky blue
        "#EE82EE", // Violet
        "#673AB7", // Deep purple
      ],
      dataLabels: {
        enabled: false,
      },
      chart: {
        id: "ivis-chart",
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
        } as const,
      },
      title: {
        text: "Weekly Average growth after treatment",
        align: "center" as const,
        margin: 20,
        style: {
          fontSize: "16px",
          fontWeight: 600,
        },
      },
      subtitle: {
        align: "center" as const,
        margin: 20,
        style: {
          fontSize: "12px",
          fontWeight: 400,
        },
      },

      xaxis: {
        type: "datetime" as const,
      },
      yaxis: {
        title: {
          text: "Growth",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },
      markers: {
        size: 5,
      },
    } as ApexOptions,
    series: [] as { name: string; data: [number, number][] }[],
  };
  const series = data.datasets.map((dataset) => ({
    name: dataset.name,
    data: dataset.data.map(
      (value, index) => [Number(data.labels[index]), value] as [number, number]
    ),
  }));

  if (!data) return <></>;
  return (
    <Chart
      key={JSON.stringify(data)}
      options={config.options}
      series={series}
      type="bar"
    />
  );
}
