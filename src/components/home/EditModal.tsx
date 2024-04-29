import { useEffect, useRef, useState } from "react";

import "../../index.css";
import { DataEntity, EditEntity } from "../../types/types";
import axios from "axios";

interface Props {
  data: DataEntity | null;
  close: () => void;
  isIvis: boolean;
}
export default function EditModal({ data, close, isIvis }: Props) {
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const newData = mappedData.data;
    try {
      const arr: any[] = [];
      newData.forEach((item) => {
        for (const [key, value] of Object.entries(item.data)) {
          if (value) {
            const originalItem = data.data.find(
              (mapitem) => mapitem.name === item.name
            );
            const dateVal = originalItem.data.find(
              (item) => formatDate(item[0]) === key
            );

            arr.push({
              name: item.name,
              date: dateVal?.[0] || new Date(key).getTime(),
              value,
            });
          }
        }
      });
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/update`,
        {
          data: arr,
          type: isIvis ? "ivis" : "tumor",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  const dates = useRef(new Set<string>());
  const [mappedData, setMappedData] = useState<EditEntity>(null);
  useEffect(() => {
    dates.current = new Set();
    const newData = {
      ...data,
      data: data.data.map((item) => ({
        ...item,
        data: item.data.reduce((old, current) => {
          const [date, value] = current;
          const newDate = formatDate(date);
          return { ...old, [newDate]: value };
        }, {} as Record<string, number>),
      })),
    };
    setMappedData(newData);
  }, [data]);

  function formatDate(item: number) {
    const date = new Date(item);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day}`;
    dates.current.add(formattedDate);
    return formattedDate;
  }
  if (!data || !mappedData) return <></>;
  return (
    <div className="fixed overflow-hidden z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={() => close()}
          ></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[1200px] "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="font-bold text-lg">{data.group_name}</div>
            </div>
            <div className="overflow-x-auto">
              <div className="flex flex-nowrap">
                <div className="w-[150px] flex-shrink-0 text-nowrap"></div>
                {Array.from(dates.current).map((date) => (
                  <div
                    key={date}
                    className="w-[150px] flex-shrink-0 text-nowrap font-bold text-center"
                  >
                    {date}
                  </div>
                ))}
              </div>
              {mappedData.data.map((item, itemIndex) => (
                <div className="flex mb-1 flex-nowrap">
                  <div className="font-bold w-[150px] flex-shrink-0 border-solid  border-r-[1px] px-2">
                    {item.name}
                  </div>
                  {Array.from(dates.current).map((date) => (
                    <div className="w-[150px] flex-shrink-0 border-solid  border-r-[1px] px-2">
                      <input
                        className={
                          "outline-none border-[#ccc] border-solid border-[1px] w-[100px] block mx-auto px-2 py-1 rounded-lg"
                        }
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          const newMappedData = { ...mappedData };
                          newMappedData.data[itemIndex].data[date] =
                            Number(value);
                          setMappedData(newMappedData);
                        }}
                        value={item.data?.[date] || 0}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse  ">
            <button
              disabled={loading}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 disabled:bg-green-400 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => save()}
            >
              Save
            </button>
            <button
              disabled={loading}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => close()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
