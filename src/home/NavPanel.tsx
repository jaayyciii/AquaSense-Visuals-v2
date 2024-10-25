import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

// component props
type NavPanelProps = {
  nView: number;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function NavPanel({ nView, setPrompt }: NavPanelProps) {
  const navigate = useNavigate();
  // log out function obtained from Auth Context
  const { logout } = useAuth();

  // handles log out function
  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      setPrompt(
        "Oops! Something went wrong while logging out. Please try again or check your connection."
      );
    }
  }

  return (
    <>
      <DesktopNavigationBar
        nView={nView}
        navigate={navigate}
        handleLogout={handleLogout}
      />
      <MobileNavigationBar
        nView={nView}
        navigate={navigate}
        handleLogout={handleLogout}
      />
    </>
  );
}

type NavigationBarType = {
  nView: number;
  navigate: (path: string) => void;
  handleLogout: () => void;
};

const DesktopNavigationBar = ({
  nView,
  navigate,
  handleLogout,
}: NavigationBarType) => (
  <div
    className="d-flex flex-column fixed-top bg-primary shadow text-white pb-3 px-4 d-none d-md-flex"
    style={{ height: "100%", width: "260px" }}
  >
    <div style={{ height: "55px" }} />
    <div className="d-flex flex-column flex-grow-1 justify-content-between mt-4">
      <div>
        {/* Upper Buttons */}
        <button
          className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
          style={{ fontSize: "1.1em" }}
          onClick={() => navigate("/home")}
        >
          <i className="bi bi-grid me-3" style={{ fontSize: "20px" }} />
          Home
        </button>
        <button
          className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
          style={{ fontSize: "1.1em" }}
          onClick={() => navigate("/home/data-archive")}
        >
          <i className="bi bi-archive me-3" style={{ fontSize: "20px" }} />
          Data Archive
        </button>
        <button
          className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
          style={{ fontSize: "1.1em" }}
          onClick={() => navigate("/home/location")}
        >
          <i className="bi bi-compass me-3" style={{ fontSize: "20px" }} />
          Location
        </button>
        <button
          className="btn btn-primary d-flex align-items-center fw-medium position-relative px-2 py-1 w-100"
          style={{ fontSize: "1.1em" }}
          data-bs-toggle="modal"
          data-bs-target="#notifications"
        >
          <i className="bi bi-bell me-3" style={{ fontSize: "20px" }} />
          Notifications
          {nView > 0 && (
            <span
              className="badge text-bg-secondary"
              style={{
                fontSize: "0.75em",
                marginLeft: "35px",
                padding: "0.2em 0.4em",
              }}
            >
              {nView}
            </span>
          )}
        </button>
      </div>
      <div>
        {/* Lower Buttons */}
        <div>
          <button
            className="btn btn-primary d-flex align-items-center fw-medium
           px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            onClick={() => navigate("/home/help-center")}
          >
            <i
              className="bi bi-question-circle me-3"
              style={{ fontSize: "20px" }}
            />
            Help Center
          </button>
          <button
            className="btn btn-primary d-flex align-items-center fw-medium
           px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            onClick={() => handleLogout()}
          >
            <i
              className="bi bi-box-arrow-left me-3"
              style={{ fontSize: "20px" }}
            />
            Log out
          </button>
        </div>
        <div
          className="d-flex flex-column justify-content-between small text-light w-100 mt-3"
          style={{ fontSize: "11px" }}
        >
          <div>
            <a href="#" className="text-light text-decoration-none me-2">
              Terms & Conditions
            </a>
            <a href="#" className="text-light text-decoration-none">
              About
            </a>
          </div>
          <div>AquaSense © 2024. All rights reserved.</div>
        </div>
      </div>
    </div>
  </div>
);

const MobileNavigationBar = ({
  nView,
  navigate,
  handleLogout,
}: NavigationBarType) => (
  <div
    className="d-flex justify-content-between fixed-bottom bg-primary px-4 d-block d-md-none"
    style={{ height: "55px" }}
  >
    <button
      className="btn btn-primary d-flex align-items-center px-3"
      onClick={() => navigate("/home")}
    >
      <i className="bi bi-grid" style={{ fontSize: "25px" }} />
    </button>
    <button
      className="btn btn-primary d-flex align-items-center px-3"
      onClick={() => navigate("/home/data-archive")}
    >
      <i className="bi bi-archive" style={{ fontSize: "25px" }} />
    </button>
    <button
      className="btn btn-primary d-flex align-items-center px-3"
      onClick={() => navigate("/home/location")}
    >
      <i className="bi bi-compass" style={{ fontSize: "25px" }} />
    </button>
    <button
      className="btn btn-primary d-flex align-items-center px-3"
      data-bs-toggle="modal"
      data-bs-target="#notifications"
    >
      <i className="bi bi-bell" style={{ fontSize: "25px" }} />
      {nView > 0 && (
        <span
          className="position-absolute ms-3 mb-3 bg-danger border border-primary rounded-circle"
          style={{ padding: "5px" }}
        />
      )}
    </button>
    <button
      className="btn btn-primary d-flex align-items-center px-3"
      onClick={() => navigate("/home/help-center")}
    >
      <i className="bi bi-question-circle" style={{ fontSize: "25px" }} />
    </button>
    <button
      className="btn btn-primary d-flex align-items-center px-3"
      onClick={() => handleLogout()}
    >
      <i className="bi bi-box-arrow-left" style={{ fontSize: "25px" }} />
    </button>
  </div>
);
