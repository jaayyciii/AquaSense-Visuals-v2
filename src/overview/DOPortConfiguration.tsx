import { useEffect, useRef, useState } from "react";
import { ref, set, update, onValue } from "firebase/database";
import { db } from "../FirebaseConfig";
import { Modal } from "bootstrap";
import type { DOConfigurationProps } from "./DOConfigurationButton";

// typescript data types
type PortConfigurationType = {
  port: number;
  define: string;
  range: [number, number];
  threshold: [number, number];
  timestamp: Date;
  unit: string;
};

export default function DOPortConfiguration({
  portListLoading,
  portList,
  setPrompt,
  admin,
}: DOConfigurationProps) {
  // modal reference
  const modalRef = useRef<HTMLDivElement>(null);
  // port configuration variables
  const [configuration, setConfiguration] = useState<PortConfigurationType>({
    port: -1,
    define: "",
    range: [0, 0],
    threshold: [0, 0],
    timestamp: new Date(0),
    unit: "",
  });
  // sets the actuation mode: lower, upper, double, non-bounded
  const [actuationMode, setActuationMode] = useState<number>(0);
  // user input errors
  const [portError, setPortError] = useState<string>("");
  const [defineError, setDefineError] = useState<string>("");
  const [unitError, setUnitError] = useState<string>("");
  const [actuationError, setActuationError] = useState<string>("");
  // loading threshold and range
  const [loading, isLoading] = useState<boolean>(false);
  // proceeds to confirmation page when user inputs have no errors
  const [inputVerified, setInputVerified] = useState<boolean>(false);

  // handles modal dismissal
  function dismissModal() {
    if (modalRef.current) {
      const modalInstance = Modal.getInstance(modalRef.current);
      if (modalInstance) {
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.remove();
          modalInstance.hide();
        }
      }
    }
    setConfiguration({
      port: -1,
      define: "",
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(0),
      unit: "",
    });
    setActuationMode(0);
    setPortError("");
    setDefineError("");
    setUnitError("");
    setActuationError("");
    setInputVerified(false);
  }

  // updates the threshold values according to the actuation mode
  function updateActuationValues() {
    switch (actuationMode) {
      case 2:
        setConfiguration({
          ...configuration,
          threshold: [configuration.threshold[0], configuration.range[1]],
        });
        break;
      case 3:
        setConfiguration({
          ...configuration,
          threshold: [configuration.range[0], configuration.threshold[1]],
        });
        break;
      case 4:
        setConfiguration({
          ...configuration,
          threshold: [configuration.range[0], configuration.range[1]],
        });
        break;
      default:
        break;
    }
  }

  // checks whether the user inputs are valid, if so, it proceeds to confirmation page
  function verifyInput() {
    setPortError("");
    setDefineError("");
    setUnitError("");
    setActuationError("");

    if (configuration.port === -1) {
      setPortError("Please select an active channel to configure");
      return;
    }

    if (configuration.define === "") {
      setDefineError("Please specify the sensor type for this channel");
      return;
    }

    if (configuration.unit === "") {
      setUnitError("Please enter the SI unit for the sensor readings.");
      return;
    }

    if (actuationMode === 0) {
      setActuationError("Please select the mode of actuation for your sensor");
      return;
    } else {
      updateActuationValues();
      if (
        configuration.threshold[0] < configuration.range[0] ||
        configuration.threshold[1] > configuration.range[1]
      ) {
        setActuationError(
          `Threshold values must be within the sensor's range: ${configuration.range[0]} - ${configuration.range[1]}`
        );
        return;
      }
      if (configuration.threshold[0] > configuration.threshold[1]) {
        setActuationError(
          "The minimum threshold value cannot exceed the maximum threshold."
        );
        return;
      }
    }

    setTimeout(() => {
      setInputVerified(true);
    }, 0);
  }

  // handles port configuration submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!admin) return;

    if (!inputVerified) return;
    try {
      await update(ref(db, `ConfigurationFiles/Ports/${configuration.port}`), {
        define: configuration.define,
        threshold: {
          max: configuration.threshold[1],
          min: configuration.threshold[0],
        },
        timestamp: new Date()
          .toLocaleString("en-US", { dateStyle: "short", timeStyle: "medium" })
          .replace(/\//g, "-"),
        unit: configuration.unit,
      });

      await set(
        ref(db, `ConfigurationFiles/Display/${configuration.port}`),
        "T"
      );

      setPrompt(
        `${
          portList[configuration.port].name
        } Sensor has been successfully configured for ${
          configuration.define
        }. Please check to verify the changes.`
      );
    } catch (error) {
      console.error(error);
      setPrompt(
        `Oops! Something went wrong. ${
          portList[configuration.port].name
        } configuration was unsuccessful. Please try again or check your connection`
      );
    } finally {
      dismissModal();
    }
  }

  // gets the current range of the selected port, and sets the default threshold value to such
  useEffect(() => {
    setActuationMode(0);
    if (configuration.port === -1) return;

    isLoading(true);
    const unsubscribe = onValue(
      ref(db, `ConfigurationFiles/Ports/${configuration.port}/range`),
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const firebaseSnapshot = snapshot.val();
            setConfiguration({
              ...configuration,
              define: "",
              range: [firebaseSnapshot.min, firebaseSnapshot.max],
              threshold: [firebaseSnapshot.min, firebaseSnapshot.max],
              unit: "",
            });
            isLoading(false);
          }
        } catch (error) {
          console.error(error);
          setPrompt(
            "Oops! Something went wrong while configuring your device. Please refresh the page and try again."
          );
          dismissModal();
        }
      }
    );

    return () => unsubscribe();
  }, [configuration.port]);

  return (
    <div
      className="modal fade"
      id="DOPortConfiguration"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      ref={modalRef}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Port Channel Configuration</h1>
            <button
              type="button"
              className="btn-close"
              onClick={dismissModal}
            />
          </div>
          <form onSubmit={handleSubmit}>
            {!inputVerified ? (
              <>
                <div className="modal-body">
                  {/* Port Assignment */}
                  <select
                    className="form-select"
                    value={configuration.port}
                    onChange={(e) =>
                      setConfiguration({
                        ...configuration,
                        port: parseInt(e.target.value, 10),
                      })
                    }
                  >
                    <option value="-1">Select Channel Assignment</option>
                    {portList.map(
                      (port, index) =>
                        port.active &&
                        !port.display && (
                          <option key={index} value={index}>
                            {port.name}
                          </option>
                        )
                    )}
                  </select>
                  {portError === "" ? (
                    <div
                      className="form-text text-info m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-info-circle" />
                      <span className="my-2">
                        {" "}
                        Inactive port channels are not shown and cannot be
                        configured
                      </span>
                    </div>
                  ) : (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2"> {portError}</span>
                    </div>
                  )}
                  {/* Sensor Type  */}
                  <div className="input-group mt-3">
                    <input
                      className="form-control"
                      value={configuration.define}
                      placeholder="e.g., Dissolved Oxygen, Salinity, Light"
                      onChange={(e) =>
                        setConfiguration({
                          ...configuration,
                          define: e.target.value,
                        })
                      }
                      disabled={configuration.port === -1 || loading}
                    />
                    <span className="input-group-text">Sensor Type</span>
                  </div>
                  {defineError !== "" && (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2"> {defineError}</span>
                    </div>
                  )}
                  {/* Sensor SI Unit */}
                  <div className="input-group mt-3">
                    <input
                      className="form-control"
                      value={configuration.unit}
                      placeholder="e.g., mg/L, PSU, g/L , Lux (lx)"
                      onChange={(e) =>
                        setConfiguration({
                          ...configuration,
                          unit: e.target.value,
                        })
                      }
                      disabled={configuration.port === -1 || loading}
                    />
                    <span className="input-group-text">Measurement Unit</span>
                  </div>
                  {unitError !== "" && (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2"> {unitError}</span>
                    </div>
                  )}
                  {/* Actuation */}
                  <div className="mt-3">
                    <h6 className="fw-normal"> Sensor Actuation </h6>
                    <div className="d-flex gap-3">
                      <select
                        className="form-select w-25"
                        value={actuationMode}
                        onChange={(e) =>
                          setActuationMode(parseInt(e.target.value))
                        }
                        disabled={configuration.port === -1 || loading}
                      >
                        <option value="0">Select Mode</option>
                        <option value="1">Double Bounded</option>
                        <option value="2">Lower Bounded</option>
                        <option value="3">Upper Bounded</option>
                        <option value="4">Non-Bounded</option>
                      </select>
                      <div className="input-group flex-grow-1">
                        <input
                          value={
                            actuationMode == 0 ||
                            actuationMode == 3 ||
                            actuationMode == 4
                              ? "-"
                              : configuration.threshold[0]
                          }
                          className="form-control"
                          onChange={(e) =>
                            setConfiguration({
                              ...configuration,
                              threshold: [
                                isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                                configuration.threshold[1],
                              ],
                            })
                          }
                          disabled={
                            actuationMode == 0 ||
                            actuationMode == 3 ||
                            actuationMode == 4
                          }
                        />
                        <span className="input-group-text">-</span>
                        <input
                          value={
                            actuationMode == 0 ||
                            actuationMode == 2 ||
                            actuationMode == 4
                              ? "-"
                              : configuration.threshold[1]
                          }
                          className="form-control"
                          onChange={(e) =>
                            setConfiguration({
                              ...configuration,
                              threshold: [
                                configuration.threshold[0],
                                isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                              ],
                            })
                          }
                          disabled={
                            actuationMode == 0 ||
                            actuationMode == 2 ||
                            actuationMode == 4
                          }
                        />
                      </div>
                    </div>
                    {actuationError === "" ? (
                      <div
                        className="form-text text-info m-0"
                        style={{ fontSize: "13px" }}
                      >
                        <i className="bi bi-info-circle" />
                        <span className="my-2">
                          {" "}
                          Please select values within the sensor's range{" "}
                          {configuration.range[0]} - {configuration.range[1]}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="form-text text-danger m-0"
                        style={{ fontSize: "13px" }}
                      >
                        <i className="bi bi-exclamation-circle-fill" />
                        <span className="my-2"> {actuationError}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={dismissModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={verifyInput}
                    disabled={portListLoading}
                  >
                    Proceed
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-body d-flex flex-column">
                  <p>
                    You are about to apply the following changes to the port
                    channel. Please review the details below and confirm your
                    changes.
                  </p>
                  <div>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Port:</strong>{" "}
                        {portList[configuration.port].name}
                      </li>
                      <li>
                        <strong>Sensor Type:</strong> {configuration.define}
                      </li>
                      <li>
                        <strong>Sensor Range:</strong> {configuration.range[0]}{" "}
                        - {configuration.range[1]}
                      </li>
                      <li>
                        <strong>Safe Range:</strong>{" "}
                        {configuration.threshold[0]} -{" "}
                        {configuration.threshold[1]}
                      </li>
                      <li>
                        <strong>SI Unit:</strong> {configuration.unit}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setInputVerified(false)}
                  >
                    Return
                  </button>
                  <button
                    type="submit"
                    className="btn btn-outline-primary"
                    disabled={portListLoading}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
