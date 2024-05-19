import axios from "axios";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { MetricsData } from "../types/types";
import { Spinner } from "flowbite-react";
import MetricsChart from "./MetricsChart";

export default function Metrics() {
  const [selectedItem, setSelectedItem] = useState({
    label: "Pilot 2",
    value: "2",
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MetricsData>(null);
  async function getData() {
    setLoading(true);
    try {
      await axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/metrics?pilot_id=${
            selectedItem.value
          }`
        )
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getData();
  }, [selectedItem]);
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-4">Metrics</h1>
      <div className="select flex justify-end items-center my-2">
        <div className="w-[300px]">
          <ReactSelect
            isDisabled={loading}
            options={[
              {
                label: "Pilot 2",
                value: "2",
              },
              {
                label: "Pilot 3",
                value: "3",
              },
              {
                label: "Pilot 4",
                value: "4",
              },
              {
                label: "Pilot 5",
                value: "5",
              },
            ]}
            value={selectedItem}
            onChange={(e) => setSelectedItem(e)}
          />
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center my-12">
          <Spinner size="xl" />
        </div>
      )}
      {!loading && (
        <div>
          <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  mb-2">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
              {selectedItem.label}
            </h5>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
              Study Duration
            </h5>
            <p className="font-normal text-gray-700  ">
              Started: {data?.study_duration?.start}
              <br />
              Ended: {data?.study_duration?.end || "Ongoing"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Overall Average Growth Before Treatment Start
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.average_tumor_growth_before?.toFixed(2)}%
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Overall Average Growth After Treatment Start
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.average_growth_after?.toFixed(2)}%
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Percentage Of Sacrificed Mice
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.sacrificed_percentage?.toFixed(2)}%
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Percentage Of Dead Mice
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.percentage_died?.toFixed(2)}%
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Average Days to Sacrifice After Study Start
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.average_days_to_sacrifice?.from_study_start?.toFixed(
                  2
                ) || 0}{" "}
                day(s)
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Average Days to Dead After Study Start
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.average_days_to_dead?.from_study_start?.toFixed(2) || 0}{" "}
                day(s)
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Average Days to Sacrifice After Treatment Start
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.average_days_to_sacrifice?.from_treatment_start?.toFixed(
                  2
                ) || 0}{" "}
                day(s)
              </p>
            </div>
            <div className="block  p-6 bg-white border border-gray-200 rounded-lg shadow  ">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900  ">
                Average Days to Dead After Treatment Start
              </h5>
              <p className="font-normal text-gray-700  ">
                {data?.average_days_to_dead?.from_treatment_start?.toFixed(2) ||
                  0}{" "}
                day(s)
              </p>
            </div>
          </div>
          <div className="my-2">
            <MetricsChart data={data.weekly_average_growth_after_treatment} />
          </div>
        </div>
      )}
    </div>
  );
}
