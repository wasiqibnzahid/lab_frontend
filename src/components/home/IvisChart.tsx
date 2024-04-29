import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { DataEntity } from "../../types/types";
import { ApexOptions } from "apexcharts";
import { Button, Spinner } from "flowbite-react";

interface Props {
  data: DataEntity[];
  showEditModal: (param: DataEntity) => void;
}
const CalliperChart: React.FC<Props> = ({ data, showEditModal }) => {
  const [itemIndex, setItemIndex] = useState(0);
  // Sample data for IVIS Imaging
  const ivisData = {
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
        text: "CO2 Weekly Dose",
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
          text: "Ivis Dosage",
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

  const chartOptions = useMemo(() => {
    console.log(
      data?.[0]?.data?.[7]?.data,
      data?.[0]?.data?.[7]?.data?.sort((a, b) => a[0] - b[0])
    );
    return data.map((group) => ({
      ...ivisData,
      series: group.data.map((item) => ({
        ...item,
        data: item.data.sort((a, b) => a[0] - b[0]),
      })),
      options: {
        ...ivisData.options,
        title: {
          ...ivisData.options.title,
          text: group.title || group.group_name,
        },
        subtitle: {
          ...ivisData.options.subtitle,
          text: group?.started_at,
        },
      },
    }));
  }, [data]);

  const totalAverage = useMemo(() => {
    console.log(data[0]);
    return {
      average: data.map((item) => ({
        name: item.group_name,
        data: item.group_average,
      })),
      total: data.map((item) => ({
        name: item.group_name,
        data: item.group_total,
      })),
    };
  }, [data]);
  const intervalRef = useRef<number>(null);
  useEffect(() => {
    if (!intervalRef.current && data.length) {
      setItemIndex(0);
      intervalRef.current = setInterval(() => {
        setItemIndex((old) => old + 1);
      }, 2000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [data]);
  useEffect(() => {
    if (data.length && itemIndex > data.length) {
      clearInterval(intervalRef.current);
    }
  }, [itemIndex]);
  if (!data.length) {
    return <div className="text-center">No Data Found</div>;
  }
  return (
    <React.Fragment>
      <h2 className="text-xl font-bold mb-4 pl-8">IVIS Imaging Data</h2>
      <div className="flex flex-col gap-8">
        {chartOptions.map((conf, i) =>
          i <= itemIndex ? (
            <React.Fragment>
              <div className="flex justify-end items-center">
                <Button onClick={() => showEditModal(data[i])}>Edit</Button>
              </div>
              <Chart
                key={conf.options.title.text + i}
                options={conf.options}
                series={conf.series}
                type="line"
                height={500}
              />
            </React.Fragment>
          ) : (
            <div className="h-[500px] flex items-center justify-center">
              {" "}
              <Spinner key={conf.options.title.text + i} />
            </div>
          )
        )}
        {itemIndex > data.length ? (
          <Chart
            options={{
              ...ivisData.options,
              title: {
                ...ivisData.options.title,
                text: "Weekly Ivis Average",
              },
            }}
            series={totalAverage.average}
            type="bar"
            height={500}
          />
        ) : (
          <div className="h-[500px] flex items-center justify-center">
            {" "}
            <Spinner key={"Average"} />
          </div>
        )}
        {itemIndex > data.length ? (
          <Chart
            options={{
              ...ivisData.options,
              title: {
                ...ivisData.options.title,
                text: "Weekly Ivis Total",
              },
            }}
            series={totalAverage.total}
            type="bar"
            height={500}
          />
        ) : (
          <div className="h-[500px] flex items-center justify-center">
            {" "}
            <Spinner key={"Total"} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default CalliperChart;
