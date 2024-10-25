import DOPortConfiguration from "./DOPortConfiguration";
import type { PortListType, ADCFormulaType } from "../home/HomeLayout";

// component props
export type DOConfigurationProps = {
  portListLoading: boolean;
  portList: PortListType[];
  adcLoading: boolean;
  adcFormula: ADCFormulaType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  admin: boolean;
};

export default function DOConfigurationButton({
  portListLoading,
  portList,
  adcLoading,
  adcFormula,
  setPrompt,
  admin,
}: DOConfigurationProps) {
  return (
    <>
      {/* Port Configuration Modal */}
      <DOPortConfiguration
        portListLoading={portListLoading}
        portList={portList}
        adcLoading={adcLoading}
        adcFormula={adcFormula}
        setPrompt={setPrompt}
        admin={admin}
      />
      {/* Port Configuration Button */}
      {admin && (
        <button
          className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
          data-bs-toggle="modal"
          data-bs-target="#DOPortConfiguration"
          style={{ height: "35px" }}
          disabled={portListLoading}
        >
          <i className="bi bi-gear" style={{ fontSize: "16px" }} />
        </button>
      )}
    </>
  );
}
