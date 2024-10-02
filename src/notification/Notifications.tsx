import { useNavigate } from "react-router-dom";
import { ref, set, remove } from "firebase/database";
import { db } from "../FirebaseConfig.ts";
import type { NotificationsType } from "../home/HomeLayout.tsx";

// component props
type NotificationProps = {
  notifications: NotificationsType[];
  admin: boolean;
};

export default function Notification({
  notifications,
  admin,
}: NotificationProps) {
  const navigate = useNavigate();

  // handles delete function, which removes the notification from the firebase
  function handleDelete(key: string) {
    if (!admin) return;
    remove(ref(db, `Notifications/${key}`)).catch((error) => {
      console.error(error);
    });
  }

  // sets the notification viewed value to true, and redirects the user to the port
  function handleNotification(port: number, key: string) {
    set(ref(db, `Notifications/${key}/viewed`), "T")
      .then(() => {
        navigate(`port-details?index=${port}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="modal fade" id="notifications">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="notificationsModal">
              Notifications
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body d-flex flex-column gap-3 mb-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.key}
                  className={`d-flex flex-column rounded align-items-center list-group-item p-2 ${
                    notification.viewed ? "bg-light" : "bg-body-secondary"
                  }`}
                >
                  <div>
                    <h6 className="fw-medium mb-1" style={{ fontSize: "14px" }}>
                      {notification.text}
                    </h6>
                  </div>
                  <div className="d-flex w-100 justify-content-between">
                    <div className="d-flex align-items-center">
                      {!notification.viewed ? (
                        <span
                          className="rounded-circle me-1"
                          style={{
                            backgroundColor: "red",
                            height: "7px",
                            width: "7px",
                          }}
                        />
                      ) : null}
                      <small
                        className="text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        {notification.timestamp.toLocaleString()}
                      </small>
                    </div>
                    <div>
                      {admin && (
                        <button
                          className="btn btn-sm btn-danger me-1 py-0"
                          data-bs-dismiss="modal"
                          onClick={() => handleDelete(notification.key)}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-primary py-0"
                        data-bs-dismiss="modal"
                        onClick={() =>
                          handleNotification(
                            notification.port,
                            notification.key
                          )
                        }
                      >
                        Handle
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
