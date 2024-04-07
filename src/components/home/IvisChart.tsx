import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { DataEntity } from "../../types/types";
import { ApexOptions } from "apexcharts";
import { Spinner } from "flowbite-react";

interface Props {
  data: DataEntity[];
}
const CalliperChart: React.FC<Props> = ({ data }) => {
  const [itemIndex, setItemIndex] = useState(0);
  // Sample data for IVIS Imaging
  const ivisData = {
    options: {
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
          text: "Tumor Volume mm^3",
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
    return data.map((group) => ({
      ...ivisData,
      series: group.data,
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
            <Chart
              key={conf.options.title.text + i}
              options={conf.options}
              series={conf.series}
              type="line"
              height={500}
            />
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
