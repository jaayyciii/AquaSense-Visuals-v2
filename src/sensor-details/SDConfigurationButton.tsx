import { PortConfigurationType } from "../home/SensorDetailPanel";
import SDPortConfiguration from "./SDPortConfiguration";

// component props
export type SDConfigurationProps = {
  portIndex: number;
  portName: string;
  portConfiguration: PortConfigurationType;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
  admin: boolean;
};

export default function SDConfigurationButton({
  portIndex,
  portName,
  portConfiguration,
  setPrompt,
  disable,
  admin,
}: SDConfigurationProps) {
  return (
    <>
      {/* Port Configuration Modal */}
      <SDPortConfiguration
        portIndex={portIndex}
        portName={portName}
        portConfiguration={portConfiguration}
        setPrompt={setPrompt}
        disable={disable || !admin}
        admin={admin}
      />
      {/* Port Configuration Button */}
      {admin && (
        <button
          className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
          data-bs-toggle="modal"
          data-bs-target="#SDPortConfiguration"
          style={{ height: "35px" }}
          disabled={disable || !admin}
        >
          <i className="bi bi-gear" style={{ fontSize: "16px" }} />
        </button>
      )}
    </>
  );
}
