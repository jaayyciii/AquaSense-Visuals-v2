// UNFINISHED

import { useState } from "react";

export default function HelpCenterPanel() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="d-flex flex-column flex-grow-1 pb-4 px-4">
      <div className="d-flex justify-content-between mt-4">
        <h4>Help Center</h4>
        <div className="input-group" style={{ maxWidth: "500px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="input-group-text text-white bg-primary">
            <i className="bi bi-search" />
          </span>
        </div>
      </div>
      <div className="d-flex gap-3 mt-3" style={{ height: "150px" }}>
        <div
          className="d-flex align-items-center justify-content-center bg-white shadow rounded h-100 p-4"
          style={{ width: "250px" }}
        >
          <div className="text-center">
            <div
              className="d-flex align-items-center justify-content-center border border-primary-subtle rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i
                className="bi bi-emoji-smile text-primary"
                style={{ fontSize: "18px" }}
              />
            </div>
            <h6 className="mt-2 mb-1">Get Started</h6>
            <p className="text-muted m-0" style={{ fontSize: "11px" }}>
              Everything you need to know how to get started with AquaSense
              Visuals
            </p>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-center bg-white shadow rounded h-100 p-4"
          style={{ width: "250px" }}
        >
          <div className="text-center">
            <div
              className="d-flex align-items-center justify-content-center border border-primary-subtle rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i
                className="bi bi-emoji-smile text-primary"
                style={{ fontSize: "18px" }}
              />
            </div>
            <h6 className="mt-2 mb-1"> Management </h6>
            <p className="text-muted m-0" style={{ fontSize: "11px" }}>
              Everything you need to know how to get started with AquaSense
              Visuals
            </p>
          </div>
        </div>
        <div
          className="d-flex align-items-center justify-content-center bg-white shadow rounded h-100 p-4"
          style={{ width: "250px" }}
        >
          <div className="text-center">
            <div
              className="d-flex align-items-center justify-content-center border border-primary-subtle rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i
                className="bi bi-emoji-smile text-primary"
                style={{ fontSize: "18px" }}
              />
            </div>
            <h6 className="mt-2 mb-1"> Data Export </h6>
            <p className="text-muted m-0" style={{ fontSize: "11px" }}>
              Everything you need to know how to get started with AquaSense
              Visuals
            </p>
          </div>
        </div>
      </div>
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-3">
        {" "}
        hey
      </div>
    </div>
  );
}
