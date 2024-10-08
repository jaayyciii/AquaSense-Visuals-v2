import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, update, onValue } from "firebase/database";
import { db } from "../FirebaseConfig";
import ConfirmActuate from "../sensor-details/ConfirmActuate";
import DeleteButton from "../sensor-details/DeleteButton";
import ActuateButton from "../sensor-details/ActuateButton";
import SDConfigurationButton from "../sensor-details/SDConfigurationButton";
import Gauge from "../sensor-details/Gauge";
import LineGraph from "../sensor-details/LineGraph";
import Numerics from "../sensor-details/Numerics";
import DataHistory from "../sensor-details/DataHistory";
import type { ContextType } from "./HomeLayout";

import loadingtile from "../assets/loadingtile.gif";

// typescript data types
export type PortConfigurationType = {
  define: string;
  range: [number, number];
  threshold: [number, number];
  timestamp: Date;
  unit: string;
};

export type HistoryType = {
  data: number;
  timestamp: Date;
};

export type ActuationTriggerType = {
  actuate: boolean;
  control: boolean;
};

export default function SensorDetailPanel() {
  const navigate = useNavigate();
  // gets the props through outlet context
  const { portListLoading, portList, setPrompt, admin } =
    useOutletContext<ContextType>();

  // gets the index value from the URL Search
  const location = useLocation();
  const URLQuery = new URLSearchParams(location.search);
  const portIndex = parseInt(URLQuery.get("index") ?? "8", 10);
  // returns to home when portIndex is invalid or not being displayed
  useEffect(() => {
    if (portIndex < 0 || 7 < portIndex || !portList[portIndex].display) {
      navigate("/home");
    }
  }, [portIndex]);

  // holds the configuration values of the specified port
  const [portConfiguration, setPortConfiguration] =
    useState<PortConfigurationType>({
      define: "",
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(0),
      unit: "",
    });
  // holds the current actuation state
  const [actuationTrigger, setActuationTrigger] =
    useState<ActuationTriggerType>({
      actuate: false,
      control: false,
    });
  // holds the current value
  const [current, setCurrent] = useState<number>(0);
  // holds the predicted value
  const [predict, setPredict] = useState<number>(0);
  // holds history
  const [history, setHistory] = useState<HistoryType[]>([]);
  // actuation loading state
  const [retrievingActuation, isRetrievingActuation] = useState<boolean>(true);
  // port configuration loading state
  const [retrievingConfiguration, isRetrievingConfiguration] =
    useState<boolean>(true);
  // history loading state
  const [retrievingHistory, isRetrievingHistory] = useState<boolean>(true);

  // gets the configuration values of the specified port
  useEffect(() => {
    isRetrievingConfiguration(true);
    const unsubscribe = onValue(
      ref(db, `ConfigurationFiles/Ports/${portIndex}`),
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const firebaseSnapshot = snapshot.val();
            setPortConfiguration({
              define: firebaseSnapshot.define,
              range: [firebaseSnapshot.range.min, firebaseSnapshot.range.max],
              threshold: [
                firebaseSnapshot.threshold.min,
                firebaseSnapshot.threshold.max,
              ],
              timestamp: new Date(firebaseSnapshot.timestamp),
              unit: firebaseSnapshot.unit,
            });
            isRetrievingConfiguration(false);
          }
        } catch (error) {
          console.error(error);
          setPrompt(
            `Oops! Unable to obtain ${portList[portIndex].name} configuration. Please check your connection and try again.`
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // gets the entire history, maximum of 3 months
  useEffect(() => {
    if (retrievingConfiguration) return;

    isRetrievingHistory(true);
    const unsubscribe = onValue(ref(db, `History/${portIndex}`), (snapshot) => {
      try {
        if (snapshot.exists()) {
          const date = Object.keys(snapshot.val());
          const days = Object.values(snapshot.val());
          const newHistory: HistoryType[] = days
            .flatMap((records: any, index) => {
              let currentDate = new Date(date[index]);
              return records.map((record: any) => {
                const newRecord: HistoryType = {
                  data: record.data,
                  timestamp: currentDate,
                };
                currentDate = new Date(currentDate.getTime() + record.offset);
                return newRecord;
              });
            })
            .filter(
              (record) => record.timestamp >= portConfiguration.timestamp
            );
          setHistory(newHistory.reverse());
          isRetrievingHistory(false);
        }
      } catch (error) {
        console.error(error);
        setPrompt(
          `Oops! Unable to obtain ${portList[portIndex].name} history. Please check your connection and try again.`
        );
      }
    });

    return () => unsubscribe();
  }, [retrievingConfiguration]);

  // gets the current value (5 second refresh-rate) of the specified port
  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, `CurrentValue/${portIndex}`),
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const firebaseSnapshot = snapshot.val();
            setCurrent(firebaseSnapshot);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // sets the notification at firebase in the event of predicted value exceeding the threshold
  useEffect(() => {
    if (retrievingHistory) return;

    if (
      portConfiguration.threshold[0] <= predict &&
      predict <= portConfiguration.threshold[1]
    )
      return;

    try {
      const num = Math.floor(Math.random() * 100);
      update(ref(db, `Notifications`), {
        [num]: {
          port: portIndex,
          timestamp: new Date()
            .toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "medium",
            })
            .replace(/\//g, "-"),
          type: 5,
          viewed: "F",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [predict, portConfiguration.threshold]);

  // gets the device actuation status
  useEffect(() => {
    isRetrievingActuation(true);
    const unsubscribe = onValue(ref(db, "Actuation/"), (snapshot) => {
      try {
        if (snapshot.exists()) {
          const firebaseSnapshot = snapshot.val();
          setActuationTrigger({
            actuate: firebaseSnapshot.actuate === "T",
            control: firebaseSnapshot.control === "T",
          });
          isRetrievingActuation(false);
        }
      } catch (error) {
        console.error(error);
        setPrompt(
          `Oops! Unable to obtain ${portList[portIndex].name} actuation status. Please check your connection and try again.`
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Confirm Actuation Modal */}
      <ConfirmActuate
        actuationTrigger={actuationTrigger}
        setPrompt={setPrompt}
        disable={portListLoading || retrievingActuation}
        admin={admin}
      />
      {/* Sensor Details Panel */}
      <div className="d-flex flex-column flex-grow-1 pb-3 px-4 ">
        <div className="d-flex justify-content-between mt-4">
          <h4>{portConfiguration.define} Details</h4>
          <div className="d-flex flex-wrap justify-content-end gap-2">
            <DeleteButton
              portIndex={portIndex}
              name={portConfiguration.define}
              setPrompt={setPrompt}
              disable={actuationTrigger.actuate || portListLoading}
              admin={admin}
            />
            <SDConfigurationButton
              portIndex={portIndex}
              portName={portList[portIndex].name}
              portConfiguration={portConfiguration}
              setPrompt={setPrompt}
              disable={
                actuationTrigger.actuate ||
                retrievingConfiguration ||
                portListLoading
              }
              admin={admin}
            />
            <div className="d-none d-md-flex">
              <ActuateButton
                actuationTrigger={actuationTrigger}
                setPrompt={setPrompt}
                disable={portListLoading || retrievingActuation}
                admin={admin}
              />
            </div>
          </div>
        </div>
        <div className="d-md-none mt-4 px-2">
          <ActuateButton
            actuationTrigger={actuationTrigger}
            setPrompt={setPrompt}
            disable={portListLoading || retrievingActuation}
            admin={admin}
          />
        </div>
        {portListLoading || retrievingConfiguration || retrievingHistory ? (
          <LoadingState />
        ) : (
          <div className="d-flex flex-column flex-grow-1 mt-3 px-2 px-md-0">
            <div
              className="row mb-4"
              style={{ height: "auto", minHeight: "340px" }}
            >
              <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                <Gauge
                  current={current}
                  range={portConfiguration.range}
                  threshold={portConfiguration.threshold}
                  unit={portConfiguration.unit}
                />
              </div>
              <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <LineGraph history={history} predict={predict} />
              </div>
              <div className="col-12 col-lg-3">
                <Numerics
                  current={current}
                  unit={portConfiguration.unit}
                  history={history}
                  predict={predict}
                  setPredict={setPredict}
                />
              </div>
            </div>
            <div>
              <DataHistory
                portConfiguration={portConfiguration}
                history={history}
                setPrompt={setPrompt}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// renders this when data are still being retrieved
const LoadingState = () => (
  <div className="d-flex flex-column flex-grow-1 mt-3 px-2 px-md-0">
    <div className="row mb-4">
      <div className="col-12 col-lg-3 mb-3 mb-lg-0">
        <img
          src={loadingtile}
          className="rounded w-100"
          style={{ objectFit: "cover", height: "340px" }}
        />
      </div>
      <div className="col-12 col-lg-6 mb-3 mb-lg-0">
        <img
          src={loadingtile}
          className="rounded w-100"
          style={{ objectFit: "cover", height: "340px" }}
        />
      </div>
      <div className="col-12 col-lg-3 mb-3 mb-lg-0">
        <img
          src={loadingtile}
          className="rounded w-100 mb-3"
          style={{ objectFit: "cover", height: "155px" }}
        />
        <img
          src={loadingtile}
          className="rounded w-100 mt-3"
          style={{ objectFit: "cover", height: "155px" }}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <img
          src={loadingtile}
          className="rounded w-100"
          style={{ objectFit: "cover", height: "550px" }}
        />
      </div>
    </div>
  </div>
);
