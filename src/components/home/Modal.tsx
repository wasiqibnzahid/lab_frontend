import { useState } from "react";

import ReactSelect from "react-select";
import "../../index.css";
import axios from "axios";

export default function Modal() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>(null);
  const [isIvis, setIsIvis] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    label: "Pilot 3",
    value: "3",
  });
  async function save() {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pilot_id", selectedItem.value);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/${isIvis ? "ivis" : "tumor"}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } finally {
      // setLoading(false);
      // setShowModal(false);
      setFile(null);
      // window.location.reload();
    }
  }
  return (
    <div>
      <span className="cursor-pointer" onClick={() => setShowModal(true)}>
        Update Data
      </span>
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
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* File Upload Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div className=" select flex justify-between">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        Upload File
                      </h3>
                      <ReactSelect
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
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Click to browse.</p>
                      {/* Drop Zone */}
                      <label htmlFor="inputF">
                        <div className="cursor-pointer mt-4 border-2 border-dashed border-blue-400 rounded-lg p-6 bg-blue-100 text-gray-700">
                          <div className="flex justify-center">
                            <svg
                              className="w-[300px] h-[100px] text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 15l4.5-4.5m0 0l4.5 4.5m-4.5-4.5v9"
                              />
                            </svg>
                          </div>
                          <div className="text-center mt-1 text-sm cursor-pointer">
                            <input
                              onChange={(e) => {
                                setFile(e.target.files[0]);
                                e.target.value = "";
                              }}
                              id="inputF"
                              type="file"
                              className="opacity-0"
                            />
                            <p>{file ? file.name : "Drop files here"}</p>
                            <p className="mt-2 text-xs"></p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  disabled={loading || !file}
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
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className={` w-full inline-flex mr-auto justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    isIvis ? "bg-red-600" : "bg-blue-600"
                  }`}
                  onClick={() => setIsIvis(!isIvis)}
                >
                  {isIvis ? "Ivis" : "Calliper"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
