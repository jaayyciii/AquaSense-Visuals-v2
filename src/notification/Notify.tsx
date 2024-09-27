import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ref, set } from "firebase/database";
import { db } from "../FirebaseConfig.ts";
import { Toast } from "bootstrap";
import type { NotificationsType } from "../home/HomeLayout";

// component props
type NotifyProps = {
  notifications: NotificationsType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
};

export default function Notify({
  notifications,
  setPrompt,
  prompt,
}: NotifyProps) {
  const navigate = useNavigate();

  // display notifications toasts
  useEffect(() => {
    const notificationToasts = document.querySelectorAll(".toast");
    notificationToasts.forEach((notificationToast) => {
      const toastInstance = Toast.getOrCreateInstance(notificationToast);
      toastInstance.show();
    });
  }, [notifications]);

  // handle prompt toast with timeout
  useEffect(() => {
    if (prompt) {
      const promptToast = document.getElementById("prompt");
      if (promptToast) {
        const promptInstance = Toast.getOrCreateInstance(promptToast);
        promptInstance.show();

        const timeout = setTimeout(() => {
          setPrompt("");
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }
  }, [prompt, setPrompt]);

  // if the notifications have been handled, it will set viewed to true
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
    <div className="toast-container position-fixed bottom-0 end-0 p-3 mb-5 mb-md-0">
      {/* Notification Toasts */}
      {notifications.map(
        (notification) =>
          !notification.viewed && (
            <div
              key={notification.key}
              id="notification"
              className="toast mb-3"
              role="alert"
              data-bs-autohide="false"
            >
              <div className="toast-header d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-circle-fill text-primary" />
                  <strong className="text-black ms-2">Notification</strong>
                </div>
                <div className="d-flex align-items-center">
                  <small className="text-body-secondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
              <div className="toast-body">{notification.text}</div>
              <div className="d-flex justify-content-end m-1 p-1 gap-1 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  data-bs-dismiss="toast"
                >
                  Ignore
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  data-bs-dismiss="toast"
                  onClick={() =>
                    handleNotification(notification.port, notification.key)
                  }
                >
                  Handle
                </button>
              </div>
            </div>
          )
      )}
      {/* Instantaneous Prompt Toasts */}
      {prompt && (
        <div id="prompt" className="toast mb-3" role="alert">
          <div className="toast-header d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle-fill text-primary" />
              <strong className="text-black ms-2">Notification</strong>
            </div>
            <div className="d-flex align-items-center">
              <small className="text-body-secondary">just now</small>
            </div>
          </div>
          <div className="toast-body">{prompt}</div>
          <div className="d-flex justify-content-end m-1 p-1 gap-1 border-top">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              data-bs-dismiss="toast"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
