import   { useEffect, useState } from "react";

import ReactSelect from "react-select";
import "../../index.css";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";

interface Props {
  disabled: boolean;
  groups: { label: string; value: any }[];
}
interface Mouse {
  id: number;
  group_id: number;
  name: string;
  status: string;
  updated_at: string;
}

export default function MiceModal({ disabled, groups }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [mice, setMice] = useState<Mouse[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    label: string;
    value: any;
  }>(null);
  async function save() {
    setUpdating(true);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/mouse`, {
        mouse_data: mice,
      });
    } finally {
      setUpdating(false);
    }
  }
  async function getMice(group_id: string) {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/mouse`, {
        params: {
          group_id,
        },
      })
      .then((res) => {
        setMice(res.data.data);
        setLoading(false);
      });
  }
  useEffect(() => {
    setSelectedItem(groups?.[0] || null);
  }, [groups, showModal]);
  useEffect(() => {
    if (!selectedItem) return;
    getMice(selectedItem.value);
  }, [selectedItem]);
  function updateMouseStatus(
    index: number,
    key: "status" | "updated_at",
    value: string
  ) {
    setMice((old) => {
      const newMice = [...old];
      newMice[index][key] = value;
      return newMice;
    });
  }
  return (
    <div>
      <Button
        disabled={disabled}
        className="cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        View Mouse Data
      </Button>
      {showModal && (
        <div className="fixed overflow-hidden z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowModal(false)}
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-flex h-full align-bottom bg-white min-h-[300px] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className="select flex justify-between items-center">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        Update Mouse Information
                      </h3>
                      <ReactSelect
                        options={groups}
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-evenly items-center mb-2">
                  <div className="px-2 text-center w-1/3 font-bold">Name</div>
                  <div className="px-2 text-center w-1/3 font-bold">Status</div>
                  <div className="px-2 w-1/3 text-center font-bold">
                    Status Changed At
                  </div>
                </div>
              </div>
              <div className="px-2">
                {loading && (
                  <div className="flex items-center justify-center">
                    <Spinner size="xl"></Spinner>
                  </div>
                )}
                {!loading &&
                  mice.map((mouse, index) => (
                    <div className="flex justify-evenly items-center mb-2">
                      <div className="px-2 text-center w-1/3">{mouse.name}</div>
                      <div className="px-2 w-1/3">
                        {" "}
                        <input
                          type="text"
                          value={mouse.status}
                          onChange={(e) =>
                            updateMouseStatus(index, "status", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="Status"
                          required
                        />
                      </div>
                      <div className="px-2 w-1/3">
                        {" "}
                        <input
                          value={mouse.updated_at}
                          onChange={(e) =>
                            updateMouseStatus(
                              index,
                              "updated_at",
                              e.target.value
                            )
                          }
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="Status Changed At"
                          required
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-auto px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  disabled={updating}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 disabled:bg-green-400 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => save()}
                >
                  Save
                </button>
                <button
                  disabled={updating}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
