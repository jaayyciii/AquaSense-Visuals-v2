import { useState, useEffect, useRef } from "react";
import { ArchiveType } from "../home/DataArchivePanel";
import { get, onValue, ref, set } from "firebase/database";
import { db } from "../FirebaseConfig";
import { HistoryType } from "../home/SensorDetailPanel";
import { Modal } from "bootstrap";

type ExportArchiveProps = {
  exportArchive: ArchiveType | undefined;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

type DownloadType = {
  fileName: string;
  archiveID: string;
  extension: string;
};

export default function ExportArchive({
  exportArchive,
  setPrompt,
}: ExportArchiveProps) {
  // modal reference
  const modalRef = useRef<HTMLDivElement>(null);
  // download archive details
  const [download, setDownload] = useState<DownloadType>({
    fileName: "",
    archiveID: "",
    extension: "csv",
  });
  //const [response, setResponse] = useState<any>();
  const [appFlag, setAppFlag] = useState<boolean>(false);
  const [serverFlag, setServerFlag] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);

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
  }

  // handles archive export button, sends request flag to the server
  async function handleExport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDownload({ ...download, archiveID: exportArchive?.id || "-1" });

    if (serverFlag) {
      setPrompt(
        "The server is still processing another request. Please wait for a few minutes and try again."
      );
      return;
    }

    try {
      await set(ref(db, "ExportArchive/appFlag"), "F");
      setAppFlag(false);
      if (serverFlag) return;

      await set(ref(db, "ExportArchive/request"), download.archiveID);
      await set(ref(db, "ExportArchive/appFlag"), "T");
      setAppFlag(true);
    } catch (error) {
      console.error(error);
    }
  }

  // retrieves the server flag value
  useEffect(() => {
    isLoading(true);
    const unsubscribe = onValue(
      ref(db, "ExportArchive/serverFlag/"),
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const firebaseSnapshot = snapshot.val();
            setServerFlag(firebaseSnapshot == "T");
            isLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // waits and processes the data retrieved from the server
  useEffect(() => {
    if (!appFlag) return;

    if (appFlag && serverFlag) {
      const fetchData = async () => {
        try {
          const snapshot = await get(ref(db, "ExportArchive/response"));
          if (snapshot.exists()) {
            const date = Object.keys(snapshot.val());
            const days = Object.values(snapshot.val());
            const archiveRecords: HistoryType[] = days.flatMap(
              (records: any, index) => {
                const recordsInArray = Object.values(records);
                let currentDate = new Date(date[index]);
                return recordsInArray.map((record: any) => {
                  const newRecord: HistoryType = {
                    data: record.data,
                    timestamp: currentDate,
                  };
                  currentDate = new Date(currentDate.getTime() + record.offset);
                  return newRecord;
                });
              }
            );

            if (download.extension === "csv") {
              downloadCSV(archiveRecords);
            } else {
              downloadJSON(archiveRecords);
            }

            try {
              await set(ref(db, "ExportArchive/appFlag"), "F");
              setAppFlag(false);
            } catch (error) {
              console.error(error);
            }
          }
        } catch (error) {
          console.error(error);
          setPrompt(
            `Oops! Something went wrong while retrieving your archives. Please try again or check your connection`
          );
        }
      };

      fetchData();
      dismissModal();
    }
  }, [appFlag, serverFlag]);

  // converts data to a comma-separate value file and allows for download
  function downloadCSV(archiveRecords: HistoryType[]) {
    if (!archiveRecords) return;

    const type = ["Sensor Type", exportArchive?.define];
    const duration = [
      "Active Date",
      exportArchive?.date[0].toISOString(),
      exportArchive?.date[1].toISOString(),
    ];
    const range = [
      "Sensor Range",
      exportArchive?.range[0],
      exportArchive?.range[1],
    ];
    const threshold = [
      "Sensor Threshold",
      exportArchive?.threshold[0],
      exportArchive?.threshold[1],
    ];
    const configCSV = [type, duration, range, threshold].join("\n");
    const headers = ["Timestamp", "Data", "Unit"];
    const rows = archiveRecords
      .map((record) => [
        record.timestamp.toISOString(),
        record.data,
        exportArchive?.unit,
      ])
      .join("\n");
    const historyCSV = [headers, rows].join("\n");
    const csvContent = [configCSV, historyCSV].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AquaSense${
      download.fileName ? "-" + download.fileName : ""
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // converts data to a JSON file and allows for download
  function downloadJSON(archiveRecords: HistoryType[]) {
    if (!archiveRecords) return;

    const dataToExport = {
      sensorType: exportArchive?.define,
      activeDate: [
        exportArchive?.date[0].toISOString(),
        exportArchive?.date[1].toISOString(),
      ],
      sensorRange: [exportArchive?.range[0], exportArchive?.range[1]],
      sensorThreshold: [
        exportArchive?.threshold[0],
        exportArchive?.threshold[1],
      ],
      history: archiveRecords.map((record) => ({
        timestamp: record.timestamp.toISOString(),
        data: record.data,
        unit: exportArchive?.unit,
      })),
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AquaSense${
      download.fileName ? "-" + download.fileName : ""
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="modal fade"
      id="exportArchive"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Export Archive</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <form onSubmit={handleExport}>
            <div className="modal-body">
              <div
                className="alert alert-info text-justify"
                role="alert"
                style={{ fontSize: "13px" }}
              >
                The export process may take a few minutes as we prepare your
                download from the server. Thank you for your patience!
              </div>
              <div>
                <strong>Archive ID:</strong> {exportArchive?.id}
              </div>
              <div className="input-group mt-3">
                <input
                  className="form-control"
                  id="type"
                  value={download.fileName}
                  placeholder="Enter a custom file name"
                  onChange={(e) =>
                    setDownload({
                      ...download,
                      fileName: e.target.value,
                    })
                  }
                />
                <span className="input-group-text">File Name</span>
              </div>
              <div
                className="form-text text-info mt-0 mb-3"
                style={{ fontSize: "13px" }}
              >
                <i className="bi bi-info-circle" />
                <span className="my-2">
                  {" "}
                  Customized file name is optional.{" "}
                </span>
              </div>
              <div className="mt-3">
                <label htmlFor="fileTypeSelect" className="form-label">
                  Select File Type:
                </label>
                <select
                  id="fileTypeSelect"
                  className="form-select"
                  value={download.extension}
                  onChange={(e) =>
                    setDownload((prev) => ({
                      ...prev,
                      extension: e.target.value,
                    }))
                  }
                >
                  <option value="csv">.CSV (Comma-separated Values)</option>
                  <option value="json">
                    .JSON (JavaScript Object Notation)
                  </option>
                </select>
              </div>
              <div
                className="form-text text-info mt-0 mb-3"
                style={{ fontSize: "13px" }}
              >
                <i className="bi bi-info-circle" />
                <span className="my-2">
                  {" "}
                  Choose CSV for Excel/Sheets and JSON for advanced data
                  handling.{" "}
                </span>
              </div>
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
                type="submit"
                className="btn btn-outline-primary"
                disabled={loading || appFlag}
              >
                {appFlag ? (
                  <div className="d-flex align-items-center">
                    <span className="spinner-border spinner-border-sm text-primary me-2" />
                    <span>Exporting Archive</span>
                  </div>
                ) : (
                  "Export"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
