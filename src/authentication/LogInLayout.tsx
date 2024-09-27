import { Outlet } from "react-router-dom";
import background from "../assets/background.png";
import logo from "../assets/logo.png";

export default function LogInLayout() {
  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div
        className="d-flex flex-grow-1 h-100 px-4 py-3 border"
        style={{ minWidth: "430px", maxWidth: "430px" }}
      >
        <div className="d-flex flex-column w-100 mx-2">
          {/* Desktop Header View */}
          <div className="d-flex d-none d-sm-block">
            <img src={logo} alt="logo" style={{ width: "30px" }} />
            <span className="ms-3 fw-bold" style={{ fontSize: "20px" }}>
              AquaSense Visuals
            </span>
          </div>
          {/* Mobile Header View */}
          <div className="d-flex flex-column align-items-center justify-content-center h-25 d-block d-sm-none">
            <img src={logo} alt="logo" style={{ width: "100px" }} />
            <h1 className="mt-3 fw-bold" style={{ fontSize: "20px" }}>
              AquaSense Visuals
            </h1>
          </div>
          {/* React Router Outlet */}
          <div className="d-flex flex-grow-1 mt-5 mt-sm-0 align-items-start align-items-sm-center">
            <Outlet />
          </div>
          {/* Website Footer */}
          <footer
            className="d-flex justify-content-between"
            style={{ fontSize: "12px" }}
          >
            <div className="text-muted">© 2024 All rights reserved.</div>
            <div>
              <a href="#" className="text-muted text-decoration-none me-2">
                Terms & Conditions
              </a>
              <a href="#" className="text-muted text-decoration-none">
                About
              </a>
            </div>
          </footer>
        </div>
      </div>
      {/* Desktop Image Panel */}
      <div
        className="d-flex flex-grow-1 w-100 h-100 d-none d-sm-block"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
