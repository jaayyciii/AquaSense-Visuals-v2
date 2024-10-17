import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { db } from "../FirebaseConfig";
import type { DeleteProps } from "./DeleteButton";

export default function ConfirmDelete({
  portIndex,
  name,
  setPrompt,
  disable,
  admin,
}: DeleteProps) {
  const navigate = useNavigate();

  // handles confirm delete button, this sets the display to false at firebase
  function confirmDelete() {
    if (!admin) return;

    set(ref(db, `ConfigurationFiles/Display//${portIndex}`), "F")
      .then(() => {
        setPrompt(
          `${name} has been successfully deleted and should no longer being displayed.`
        );
        navigate("/home");
      })
      .catch((error) => {
        console.error(error);
        setPrompt(
          `An error encountered while deleting ${name}. Please check connection and try again`
        );
      });
  }

  return (
    <div
      className="modal fade"
      id="deletePort"
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
            Are you sure you want to delete this port channel? Consider
            exporting your history first to avoid losing important information.
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
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#dataExport"
            >
              <i
                className="bi bi-file-earmark-arrow-down me-2"
                style={{ fontSize: "18px" }}
              />
              Export History
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={confirmDelete}
              disabled={disable}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
