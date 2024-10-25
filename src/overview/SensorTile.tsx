import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../FirebaseConfig.ts";
import SensorGauge from "./SensorGauge.tsx";

// typescript data types
type PortConfigurationType = {
  define: string;
  range: [number, number];
  threshold: [number, number];
  unit: string;
};

// component props
type SensorTileProps = {
  name: string;
  active: boolean;
  portIndex: number;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function SensorTile({
  name,
  active,
  portIndex,
  setPrompt,
}: SensorTileProps) {
  const [sensorTileLoading, isSensorTileLoading] = useState<boolean>(true);
  // stores the existing configuration to set the chart's features
  const [port, setPort] = useState<PortConfigurationType>({
    define: "",
    range: [0, 0],
    threshold: [0, 0],
    unit: "",
  });
  // holds the current value
  const [current, setCurrent] = useState<number>(0);

  // gets the configuration values of the specified port
  useEffect(() => {
    isSensorTileLoading(true);
    const unsubscribe = onValue(
      ref(db, `ConfigurationFiles/Ports/${portIndex}`),
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const firebaseSnapshot = snapshot.val();
            setPort({
              define: firebaseSnapshot.define,
              range: [firebaseSnapshot.range.min, firebaseSnapshot.range.max],
              threshold: [
                firebaseSnapshot.threshold.min,
                firebaseSnapshot.threshold.max,
              ],
              unit: firebaseSnapshot.unit,
            });
            isSensorTileLoading(false);
          }
        } catch (error) {
          console.error(error);
          setPrompt(
            `Oops! Unable to obtain ${name} configuration. Please check your connection and try again.`
          );
        }
      }
    );

    return () => unsubscribe();
  }, [portIndex]);

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
  }, [portIndex]);

  return (
    <>
      {!sensorTileLoading && (
        <div className="d-flex flex-column justify-content-between bg-white shadow rounded p-4 w-100 h-100">
          <div className="lh-1">
            <h5 style={{ fontSize: "18px" }}>{port.define}</h5>
            <h6
              className={`card-subtitle fw-light ${
                active ? "text-success" : "badge text-bg-danger text-wrap"
              }`}
              style={{ fontSize: "11px" }}
            >
              {name}:{" "}
              <span>
                {active ? (
                  <>
                    Active <i className="bi bi-wifi" />
                  </>
                ) : (
                  <>
                    Inactive <i className="bi bi-wifi-off" />
                  </>
                )}
              </span>
            </h6>
          </div>
          <div className="align-self-center my-5" style={{ maxWidth: "280px" }}>
            <SensorGauge
              range={port.range}
              threshold={port.threshold}
              current={current}
            />
          </div>
          <div className="d-flex justify-content-center align-items-end">
            <h5 className="mx-2 my-0">
              {current.toFixed(2)} {port.unit}
            </h5>
            <span
              className={`badge ${
                port.threshold[0] > current
                  ? "bg-warning"
                  : port.threshold[1] < current
                  ? "bg-danger"
                  : "bg-success"
              }`}
              style={{ fontSize: "12px" }}
            >
              {port.threshold[0] > current
                ? "Too Low"
                : port.threshold[1] < current
                ? "Too High"
                : "Normal"}
            </span>
            <br />
          </div>
        </div>
      )}
    </>
  );
}
