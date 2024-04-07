import { Button, Spinner } from "flowbite-react";
import IvisChart from "./IvisChart";
import React, { useEffect, useRef, useState } from "react";
import CalliperChart from "./CalliperChart";
import ReactSelect, { MultiValue } from "react-select";
import CaliperTumorChart from "./CaliperTumorChart";
import axios from "axios";
import { DataEntity } from "../../types/types";
import MiceModal from "./MiceModal";
// import MideModal from "./MiceModal"

export interface PilotGroup {
  name: string;
  id: number;
}

const Home = () => {
  const [loadingTumor, setLoadingTumor] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [pilotOptions, setPilotOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [tumorState, setTumorState] = useState<DataEntity[]>([]);
  const [ivisState, setIvisState] = useState<DataEntity[]>([]);
  const [comparisonState, setComparisonState] = useState(false);
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [selectedGroups, setSelectedGroups] = useState<
    MultiValue<{ label: string; value: any }>
  >([]);
  const [selectedPilot, setSelectedPilot] =
    useState<Partial<(typeof pilotOptions)[0]>>(null);

  const isInitialized = useRef(false);
  useEffect(() => {
    axios
      .get<{ data: PilotGroup[] }>(`${import.meta.env.VITE_SERVER_URL}/pilot`)
      .then((res) => {
        const options = res.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setPilotOptions(options);

        setSelectedPilot(options[0]);
        isInitialized.current = false;
      });
  }, []);

  useEffect(() => {
    if (selectedPilot) {
      setLoadingGroups(true);
      axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/group?pilot_id=${
            selectedPilot.value
          }`
        )
        .then((res) => {
          const groups = res.data.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
          setGroupOptions(groups);
          setSelectedGroups([]);
          if (!isInitialized.current) {
            isInitialized.current = true;
            fetchData();
          }
        })
        .finally(() => setLoadingGroups(false));
    }
  }, [selectedPilot]);
  const AbortRef = useRef(new AbortController());
  async function fetchData() {
    try {
      setLoadingTumor(true);
      AbortRef.current.abort();
      AbortRef.current = new AbortController();
      const tumorPromise = axios.get<{ data: DataEntity[] }>(
        `${import.meta.env.VITE_SERVER_URL}/tumor`,
        {
          params: {
            group_id: selectedGroups.map((item) => item.value),
            pilot_id: selectedPilot.value,
          },
          signal: AbortRef.current.signal,
        }
      );
      const ivisPromise = axios.get<{ data: DataEntity[] }>(
        `${import.meta.env.VITE_SERVER_URL}/ivis`,
        {
          params: {
            group_id: selectedGroups.map((item) => item.value),
            pilot_id: selectedPilot.value,
          },
          signal: AbortRef.current.signal,
        }
      );

      const comparisonPromise = axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/combined?pilot_id=${
            selectedPilot.value
          }`
        )
        .then((res) => {
          setComparisonState(res.data.data);
        });

      const [tumorData, ivisData] = await Promise.all([
        tumorPromise,
        ivisPromise,
        comparisonPromise,
      ]);
      setTumorState(tumorData.data.data);
      setIvisState(ivisData.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTumor(false);
    }
  }

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-4">Tumor Size Dashboard</h1>

      {/* IVIS Data */}
      <div className="mb-8">
        <div className="z-40 relative mb-2 flex items-center justify-end gap-4">
          <div className="min-w-60 select">
            <ReactSelect
              value={selectedPilot}
              onChange={(e) => setSelectedPilot(e as (typeof pilotOptions)[0])}
              options={pilotOptions}
            />
          </div>
          <div className="w-96 select">
            <ReactSelect
              isLoading={loadingGroups}
              isMulti
              value={selectedGroups}
              options={groupOptions}
              onChange={(e) => setSelectedGroups(e)}
            />
          </div>
          <Button onClick={fetchData} disabled={loadingTumor}>
            Apply
          </Button>
        </div>
        <div className="?z-30 relative mb-12 flex items-start justify-end gap-4">
          {/* <Button onClick={showMouseData} disabled={loadingTumor}>
            View Mouse Data
          </Button> */}
          <MiceModal disabled={loadingTumor} groups={groupOptions} />
        </div>

        {/* Graph for IVIS Imaging Data */}
        <div className="mt-4 ">
          <div className="mb-4 flex jufify-center">
            {loadingTumor ? (
              <div className=" w-full flex h-full  items-center justify-center">
                <Spinner size="xl" />
              </div>
            ) : (
              <React.Fragment>
                <div className="w-[48%]">
                  <IvisChart data={ivisState} />
                </div>
                <div className="w-[48%]">
                  <CalliperChart data={tumorState} />
                </div>
              </React.Fragment>
            )}
          </div>
          {!loadingTumor && (ivisState.length > 0 || tumorState.length > 0) && (
            <div>
              <CaliperTumorChart data={comparisonState} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
