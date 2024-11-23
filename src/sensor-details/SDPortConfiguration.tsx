import { useEffect, useRef, useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../FirebaseConfig";
import { Modal } from "bootstrap";
import type { PortConfigurationType } from "../home/SensorDetailPanel";
import type { SDConfigurationProps } from "./SDConfigurationButton";

export default function SDPortConfiguration({
  portIndex,
  portName,
  portConfiguration,
  setPrompt,
  disable,
  admin,
}: SDConfigurationProps) {
  // modal reference
  const modalRef = useRef<HTMLDivElement>(null);
  // port configuration variables
  const [newConfiguration, setNewConfiguration] =
    useState<PortConfigurationType>(portConfiguration);
  // sets the actuation mode: lower, upper, double, non-bounded
  const [newActuationMode, setNewActuationMode] = useState<number>(1);
  // user input errors
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
    setNewConfiguration(portConfiguration);
    setNewActuationMode(1);
    setDefineError("");
    setUnitError("");
    setRangeError("");
    setActuationError("");
    setInputVerified(false);
  }

  // updates the threshold values according to the actuation mode
  function updateActuationValues() {
    const maxThreshold = 340282346638528859811704183484516925440.0;
    const minThreshold = -340282346638528859811704183484516925440.0;

    let thresholds: [number, number];
    switch (newActuationMode) {
      case 2:
        thresholds = [newConfiguration.threshold[0], maxThreshold];
        break;
      case 3:
        thresholds = [minThreshold, newConfiguration.threshold[1]];
        break;
      case 4:
        thresholds = [minThreshold, maxThreshold];
        break;
      default:
        return;
    }

    setNewConfiguration({
      ...newConfiguration,
      threshold: thresholds,
    });
  }

  // checks whether the user inputs are valid, if so, it proceeds to confirmation page
  function verifyInput() {
    setDefineError("");
    setUnitError("");
    setRangeError("");
    setActuationError("");

    if (!newConfiguration.define) {
      setDefineError("Please specify the sensor type for this channel.");
      return;
    }

    if (!newConfiguration.unit) {
      setUnitError("Please enter the SI unit for the sensor readings.");
      return;
    }

    if (newConfiguration.range[0] >= newConfiguration.range[1]) {
      setRangeError("The minimum range value cannot exceed the maximum range.");
      return;
    }

    if (newActuationMode === 0) {
      setActuationError("Please select the mode of actuation for your sensor.");
      return;
    }

    updateActuationValues();

    if (
      (newActuationMode === 2 &&
        newConfiguration.threshold[0] < newConfiguration.range[0]) ||
      newConfiguration.threshold[0] > newConfiguration.range[1] ||
      (newActuationMode === 3 &&
        newConfiguration.threshold[1] > newConfiguration.range[1]) ||
      newConfiguration.threshold[1] < newConfiguration.range[0] ||
      (newActuationMode !== 4 &&
        newActuationMode !== 2 &&
        newActuationMode !== 3 &&
        (newConfiguration.threshold[0] < newConfiguration.range[0] ||
          newConfiguration.threshold[1] > newConfiguration.range[1]))
    ) {
      setActuationError(
        `Threshold values must be within the sensor's range: ${newConfiguration.range[0]} - ${newConfiguration.range[1]}.`
      );
      return;
    }

    if (newConfiguration.threshold[0] > newConfiguration.threshold[1]) {
      setActuationError(
        "The minimum threshold value cannot exceed the maximum threshold."
      );
      return;
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
      await update(ref(db, `ConfigurationFiles/Ports/${portIndex}`), {
        define: newConfiguration.define,
        range: {
          max: newConfiguration.range[1],
          min: newConfiguration.range[0],
        },
        threshold: {
          max: newConfiguration.threshold[1],
          min: newConfiguration.threshold[0],
        },
        unit: newConfiguration.unit,
      });

      setPrompt(
        `${portName} Sensor has been successfully reconfigured for ${newConfiguration.define}. Please check to verify the changes.`
      );
    } catch (error) {
      console.error(error);
      setPrompt(
        `Oops! Something went wrong. ${portName} reconfiguration was unsuccessful. Please try again or check your connection`
      );
    } finally {
      dismissModal();
    }
  }

  useEffect(() => {
    setNewConfiguration(portConfiguration);
  }, [portConfiguration]);

  return (
    <div
      className="modal fade"
      id="SDPortConfiguration"
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
                  <select className="form-select" value={portIndex} disabled>
                    <option>{portName}</option>
                  </select>
                  {/* Sensor Type  */}
                  <div className="input-group mt-3">
                    <input
                      className="form-control"
                      value={newConfiguration.define}
                      placeholder="Indicate the type of water sensor"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          define: e.target.value,
                        })
                      }
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
                      value={newConfiguration.unit}
                      placeholder="Indicate the SI unit of water sensor"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          unit: e.target.value,
                        })
                      }
                    />
                    <span className="input-group-text">SI Unit</span>
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
                      value={newConfiguration.range[0]}
                      className="form-control"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          range: [
                            isNaN(parseFloat(e.target.value))
                              ? 0
                              : parseFloat(e.target.value),
                            newConfiguration.range[1],
                          ],
                        })
                      }
                    />
                    <span className="input-group-text">-</span>
                    <input
                      value={newConfiguration.range[1]}
                      className="form-control"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          range: [
                            newConfiguration.range[0],
                            isNaN(parseFloat(e.target.value))
                              ? 0
                              : parseFloat(e.target.value),
                          ],
                        })
                      }
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
                        value={newActuationMode}
                        onChange={(e) =>
                          setNewActuationMode(parseInt(e.target.value))
                        }
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
                            newActuationMode == 0 ||
                            newActuationMode == 3 ||
                            newActuationMode == 4
                              ? "-"
                              : newConfiguration.threshold[0]
                          }
                          className="form-control"
                          onChange={(e) =>
                            setNewConfiguration({
                              ...newConfiguration,
                              threshold: [
                                isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                                newConfiguration.threshold[1],
                              ],
                            })
                          }
                          disabled={
                            newActuationMode == 0 ||
                            newActuationMode == 3 ||
                            newActuationMode == 4
                          }
                        />
                        <span className="input-group-text">-</span>
                        <input
                          value={
                            newActuationMode == 0 ||
                            newActuationMode == 2 ||
                            newActuationMode == 4
                              ? "-"
                              : newConfiguration.threshold[1]
                          }
                          className="form-control"
                          onChange={(e) =>
                            setNewConfiguration({
                              ...newConfiguration,
                              threshold: [
                                newConfiguration.threshold[0],
                                isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                              ],
                            })
                          }
                          disabled={
                            newActuationMode == 0 ||
                            newActuationMode == 2 ||
                            newActuationMode == 4
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
                          {newConfiguration.range[0]} -{" "}
                          {newConfiguration.range[1]}
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
                    You are about to <b>apply the following changes</b> to the
                    port channel. Please review the details outlined below
                    carefully. Once you've confirmed that everything is correct,
                    proceed to confirm your action.
                  </p>
                  <div>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Port:</strong> {portName}
                      </li>
                      <li>
                        <strong>Sensor Type:</strong> {newConfiguration.define}
                      </li>
                      <li>
                        <strong>Sensor Range:</strong>{" "}
                        {newConfiguration.range[0]} {newConfiguration.unit} -{" "}
                        {newConfiguration.range[1]} {newConfiguration.unit}
                      </li>
                      <li>
                        <strong>Safe Range:</strong>{" "}
                        {newConfiguration.threshold[0]} {newConfiguration.unit}{" "}
                        - {newConfiguration.threshold[1]}{" "}
                        {newConfiguration.unit}
                      </li>
                      <li>
                        <strong>SI Unit:</strong> {newConfiguration.unit}
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
