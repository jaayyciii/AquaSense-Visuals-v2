import { ADCFormulaType } from "../home/HomeLayout";
import { PortConfigurationType } from "../home/SensorDetailPanel";
import SDPortConfiguration from "./SDPortConfiguration";

// component props
export type SDConfigurationProps = {
  portIndex: number;
  portName: string;
  portConfiguration: PortConfigurationType;
  adcFormula: ADCFormulaType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
  admin: boolean;
};

export default function SDConfigurationButton({
  portIndex,
  portName,
  portConfiguration,
  adcFormula,
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
        adcFormula={adcFormula}
        setPrompt={setPrompt}
        disable={disable}
        admin={admin}
      />
      {/* Port Configuration Button */}
      {admin && (
        <button
          className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
          data-bs-toggle="modal"
          data-bs-target="#SDPortConfiguration"
          style={{ height: "35px" }}
          disabled={disable}
        >
          <i className="bi bi-gear" style={{ fontSize: "16px" }} />
        </button>
      )}
    </>
  );
}
