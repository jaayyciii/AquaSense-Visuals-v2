import DataExport from "./DataExport";
import type {
  PortConfigurationType,
  HistoryType,
} from "../home/SensorDetailPanel";

// component props
export type ExportProps = {
  portConfiguration: PortConfigurationType;
  history: HistoryType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function ExportButton({
  portConfiguration,
  history,
  setPrompt,
}: ExportProps) {
  return (
    <>
      {/* Data Export Modal */}
      <DataExport
        portConfiguration={portConfiguration}
        history={history}
        setPrompt={setPrompt}
      />
      {/* Data Export Button */}
      <button
        type="button"
        className="btn btn-sm btn-outline-primary d-flex align-items-center px-2"
        data-bs-toggle="modal"
        data-bs-target="#dataExport"
        style={{ height: "30px" }}
      >
        <i
          className="bi bi-file-earmark-arrow-down"
          style={{ fontSize: "18px" }}
        />
        <span className="ms-2 d-none d-md-flex">Export History</span>
      </button>
    </>
  );
}
