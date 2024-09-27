import { ref, set } from "firebase/database";
import { db } from "../FirebaseConfig";
import type { ActuateProps } from "./ActuateButton";

export default function ConfirmActuate({
  actuationTrigger,
  setPrompt,
  disable,
}: ActuateProps) {
  // handles the actuate button. toggles the actuate status from true-false, vice-versa
  function confirmActuate() {
    set(ref(db, "Actuation/actuate"), actuationTrigger.actuate ? "F" : "T")
      .then(() => {
        setPrompt(
          !actuationTrigger.actuate
            ? "System has successfully triggered the water change process. Please ensure that the reservoir has sufficient water for dilution."
            : "System has successfully terminated the water change process."
        );
      })
      .catch((error) => {
        console.error(error);
        setPrompt(
          "An error encountered while controlling the device's actuation. Please check connection and try again"
        );
      });
  }

  return (
    <div
      className="modal fade"
      id="actuate"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Confirm Action</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body">
            Are you sure you want to{" "}
            {actuationTrigger.actuate ? "terminate" : "trigger"} the water
            change?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              data-bs-dismiss="modal"
              onClick={confirmActuate}
              disabled={!actuationTrigger.control || disable}
            >
              {!actuationTrigger.actuate
                ? "Trigger Water Change"
                : "Terminate Water Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
