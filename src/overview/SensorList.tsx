import { Link } from "react-router-dom";
import { useMemo } from "react";
import SensorTile from "./SensorTile";
import type { PortListType } from "../home/HomeLayout";
import nodisplay from "../assets/nodisplay.png";
import loadingtile from "../assets/loadingtile.gif";

// component props
type SensorListProps = {
  portListLoading: boolean;
  portList: PortListType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function SensorList({
  portListLoading,
  portList,
  setPrompt,
}: SensorListProps) {
  // returns true when there are no ports displayed; otherwise, false
  const noPortsDisplayed: boolean = useMemo(() => {
    return portList.filter((port) => port.display).length === 0;
  }, [portList]);

  return (
    <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-4 w-100">
      {portListLoading ? (
        <LoadingState />
      ) : noPortsDisplayed ? (
        <NoPortsDisplayed />
      ) : (
        portList.map(
          (port, portIndex) =>
            port.display && (
              <Link
                key={port.name}
                to={`port-details?index=${portIndex}`}
                role="button"
                className="btn p-0 w-100"
                style={{ width: "auto", maxWidth: "320px", maxHeight: "340px" }}
              >
                <SensorTile
                  name={port.name}
                  active={port.active}
                  portIndex={portIndex}
                  setPrompt={setPrompt}
                />
              </Link>
            )
        )
      )}
    </div>
  );
}

const LoadingState = () => (
  <>
    <div>
      <img
        src={loadingtile}
        className="rounded"
        style={{ width: "auto", maxWidth: "320px", minHeight: "340px" }}
      />
    </div>
    <div>
      <img
        src={loadingtile}
        className="rounded"
        style={{ width: "auto", maxWidth: "320px", minHeight: "340px" }}
      />
    </div>
  </>
);

const NoPortsDisplayed = () => (
  <div className="d-flex flex-column justify-content-center align-items-center rounded h-100 w-100 p-3">
    <img src={nodisplay} style={{ maxWidth: "150px", height: "auto" }} />
    <h2 className="text-primary text-center mt-2"> No Ports Displayed </h2>
    <p className="text-center fw-medium" style={{ fontSize: "14px" }}>
      Our virtual fish tank is empty. Time to configure some ports!
    </p>
  </div>
);
