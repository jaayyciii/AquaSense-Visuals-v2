import type { ActuationTriggerType } from "../home/SensorDetailPanel";

// component props
export type ActuateProps = {
  actuationTrigger: ActuationTriggerType;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
};

export default function ActuateButton({
  actuationTrigger,
  disable,
}: ActuateProps) {
  return (
    <>
      {/* Actuate Button */}
      <div className="btn-group w-100">
        <button
          type="button"
          className={`btn btn-sm d-flex align-items-center px-2 ${
            actuationTrigger.actuate ? "btn-primary" : "btn-outline-primary"
          }`}
          data-bs-toggle="modal"
          data-bs-target="#actuate"
          style={{ height: "35px" }}
          disabled={!actuationTrigger.control || disable}
        >
          <i className="bi bi-moisture me-2" style={{ fontSize: "18px" }} />
          {!actuationTrigger.actuate
            ? "Trigger Water Change"
            : "Terminate Water Change"}
        </button>
        {actuationTrigger.actuate && (
          <button
            type="button"
            className="btn btn-sm btn-primary d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#actuate"
            style={{ maxWidth: "30px", height: "35px" }}
            disabled={!actuationTrigger.control || disable}
          >
            <div
              className="spinner-grow spinner-border-sm"
              style={{ height: "12px", width: "12px" }}
            />
          </button>
        )}
      </div>
    </>
  );
}
