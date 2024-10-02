import { useOutletContext } from "react-router-dom";
import DOConfigurationButton from "../overview/DOConfigurationButton";
import SensorList from "../overview/SensorList";
import Calendar from "../overview/Calendar";
import type { ContextType } from "./HomeLayout";

export default function DeviceOverviewPanel() {
  // gets the props through outlet context
  const { portListLoading, portList, setPrompt, admin } =
    useOutletContext<ContextType>();

  return (
    <>
      <div className="d-flex flex-column flex-grow-1 pb-3 px-4">
        <div className="d-flex justify-content-between mt-4">
          <h4>Device Overview</h4>
          <DOConfigurationButton
            portListLoading={portListLoading}
            portList={portList}
            setPrompt={setPrompt}
            admin={admin}
          />
        </div>
        {/* Display Real-time Sensor List */}
        <div className="d-flex flex-grow-1 mt-3">
          <SensorList
            portListLoading={portListLoading}
            portList={portList}
            setPrompt={setPrompt}
          />
        </div>
      </div>
      <div
        className="d-flex flex-column pe-4 d-none d-xl-flex"
        style={{ minWidth: "355px" }}
      >
        <div className="mt-4 border">
          <Calendar />
        </div>
      </div>
    </>
  );
}
