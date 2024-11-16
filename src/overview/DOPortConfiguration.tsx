import { useRef, useState } from "react";
import { ref, set, update } from "firebase/database";
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
  portList,
  setPrompt,
  disable,
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
  const [rangeError, setRangeError] = useState<string>("");
  const [actuationError, setActuationError] = useState<string>("");
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
    setRangeError("");
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
          threshold: [
            -340282346638528859811704183484516925440.0,
            340282346638528859811704183484516925440.0,
          ],
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
      setUnitError("Please enter the SI unit for the sensor readings");
      return;
    }

    if (configuration.range[0] >= configuration.range[1]) {
      setRangeError("The minimum range value cannot exceed the maximum range.");
      return;
    }

    if (actuationMode === 0) {
      setActuationError("Please select the mode of actuation for your sensor");
      return;
    } else {
      updateActuationValues();
      if (actuationMode !== 4) {
        if (
          configuration.threshold[0] < configuration.range[0] ||
          configuration.threshold[1] > configuration.range[1]
        ) {
          setActuationError(
            `Threshold values must be within the sensor's range: ${configuration.range[0]} - ${configuration.range[1]}`
          );
          return;
        }
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
        range: {
          max: configuration.range[1],
          min: configuration.range[0],
        },
        threshold: {
          max: configuration.threshold[1],
          min: configuration.threshold[0],
        },
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
                        Inactive and unassigned ADC Formula port channels are
                        hidden and non-configurable.
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
                      disabled={configuration.port === -1}
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
                      disabled={configuration.port === -1}
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
                  {/* Sensor Range */}
                  <h6 className="fw-normal mt-3"> Sensor Range </h6>
                  <div className="input-group flex-grow-1 ">
                    <input
                      value={configuration.range[0]}
                      className="form-control"
                      onChange={(e) =>
                        setConfiguration({
                          ...configuration,
                          range: [
                            isNaN(parseFloat(e.target.value))
                              ? 0
                              : parseFloat(e.target.value),
                            configuration.range[1],
                          ],
                        })
                      }
                      disabled={configuration.port === -1}
                    />
                    <span className="input-group-text">-</span>
                    <input
                      value={configuration.range[1]}
                      className="form-control"
                      onChange={(e) =>
                        setConfiguration({
                          ...configuration,
                          range: [
                            configuration.range[0],
                            isNaN(parseFloat(e.target.value))
                              ? 0
                              : parseFloat(e.target.value),
                          ],
                        })
                      }
                      disabled={configuration.port === -1}
                    />
                  </div>
                  {rangeError === "" ? (
                    <div
                      className="form-text text-info m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-info-circle" />
                      <span className="my-2">
                        {" "}
                        Define an ideal range based on your sensor type to set
                        the visualization limits effectively.
                      </span>
                    </div>
                  ) : (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2"> {rangeError}</span>
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
                        disabled={configuration.port === -1}
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
                    disabled={disable}
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
                    disabled={disable}
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
