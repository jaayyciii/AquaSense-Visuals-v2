import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../AuthContext";

// component props
type UpdateProfileProps = {
  initials: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  admin: boolean;
};

export default function UpdateProfile({
  initials,
  setPrompt,
  admin,
}: UpdateProfileProps) {
  // holds user credentials obtained from Auth Context
  const { currentUser } = useAuth();
  // sets a prompt when there is an error encountered when updating
  const [updateError, setUpdateError] = useState<string>("");
  // boolean value that switches to allow/ deny user from updating profile
  const [editing, isEditing] = useState(false);
  // loading value to disable buttons when updating
  const [updating, isUpdating] = useState(false);
  // use state that holds the new display name
  const [newDisplayName, setNewDisplayName] = useState(
    currentUser?.displayName ?? "Guest"
  );

  // handle update profile function
  async function handleUpdateProfile() {
    if (currentUser) {
      try {
        isUpdating(true);
        await updateProfile(currentUser, { displayName: newDisplayName });
        setPrompt(
          "User profile name has been updated successfully. Please refresh the page to verify changes."
        );
      } catch (error) {
        console.error(error);
        setUpdateError(
          "Oops! Something went wrong while updating your profile. Please try again or check your connection."
        );
      } finally {
        isEditing(false);
        isUpdating(false);
      }
    }
  }

  return (
    <div
      className="modal fade"
      id="updateprofile"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">User Profile</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body d-flex flex-column justify-content-center align-items-center text-center border">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle bg-primary text-white fw-medium"
              style={{
                height: "150px",
                width: "150px",
                fontSize: "75px",
              }}
            >
              {initials}
            </div>
            <div className="my-3 w-75">
              {updateError && (
                <div
                  className="alert alert-info text-justify"
                  role="alert"
                  style={{ fontSize: "13px" }}
                >
                  {updateError}
                </div>
              )}
              {editing ? (
                <div className="input-group w-100 mx-auto">
                  <span className="input-group-text bg-primary text-white">
                    Edit Name:
                  </span>
                  <input
                    type="text"
                    className="form-control d-inline w-50"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                  />
                </div>
              ) : (
                <h3 className="d-flex justify-content-center align-items-center">
                  <span>{currentUser?.displayName}</span>
                  <i
                    className="bi bi-pencil-fill text-primary ms-2"
                    style={{ fontSize: "1rem" }} // Make the icon smaller
                    role="button"
                    onClick={() => isEditing(true)}
                  />
                </h3>
              )}
              <p className="mt-2 mb-0">
                {currentUser?.email}{" "}
                <span className={`badge ${admin ? "bg-success" : "bg-info"}`}>
                  {admin ? " Administator" : " Guest"}
                </span>
              </p>
            </div>
            <div
              className="text-muted lh-1 mt-0 mb-2"
              style={{ fontSize: "12px" }}
            >
              <code>
                {" "}
                Account Created: {currentUser?.metadata.creationTime}
                <br />
                Last Sign In: {currentUser?.metadata.lastSignInTime}
              </code>
            </div>
          </div>
          <div className="modal-footer">
            {editing && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => isEditing(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleUpdateProfile()}
                  disabled={updating}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
