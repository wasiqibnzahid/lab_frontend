import React from "react";
import Chart from "react-apexcharts";

const CaliperTumorChart: React.FC<{ data: any }> = ({
  data,
}: {
  data: any;
}) => {
  // Sample data for IVIS Imaging
  const ivisData = {
    options: {
      title: {
        text: "Tumor Volume vs. IVIS Luminosity",
        align: "center",
      },
      yaxis: {
        tickAmount: 7,

        title: {
          text: "Tumor Volume mm^3",
          style: {
            fontSize: "14px",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },
      xaxis: {
        title: {
          text: "VIS [p/s] * 10^7",
        },
        tickAmount: 10,
        labels: {
          formatter: function (val: string) {
            return parseFloat(val).toFixed(1);
          },
        },
      },
    } satisfies ApexCharts.ApexOptions,
    series: [
      {
        name: "Data",
        data: data.map((item: any) => item.data),
      },
    ],
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-8">
        <Chart
          options={ivisData.options}
          series={ivisData.series}
          type="scatter"
          height={500}
        />
      </div>
    </React.Fragment>
  );
};

export default CaliperTumorChart;
