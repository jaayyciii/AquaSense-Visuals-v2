import { useState } from "react";
import { ArchiveType } from "../home/DataArchivePanel";
//import { get, onValue, ref, set } from "firebase/database";
//import { db } from "../FirebaseConfig";

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
  const [download, setDownload] = useState<DownloadType>({
    fileName: "",
    archiveID: "",
    extension: "csv",
  });
  const [serverFlag, setServerFlag] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  //const request = exportArchive?.id ?? -1;

  async function handleExport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDownload({ ...download, archiveID: exportArchive?.id || "999" });
    setPrompt(
      `Fuck you. ${download.fileName}, ${download.archiveID}, ${download.extension}`
    );

    /*
    try {
      await set(ref(db, "ExportArchive/appFlag"), "F");
      console.log("set app false");
      if (serverFlag) return;
      console.log("get server false");

      await set(ref(db, "ExportArchive/request"), request);
      console.log("set app request");
      await set(ref(db, "ExportArchive/appFlag"), "T");
      console.log("set app true");

      // WORST WAITING METHOD EVER

      if (serverFlag) {
        const snapshot = await get(ref(db, "ExportArchive/response"));

        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      }
      await set(ref(db, "ExportArchive/appFlag"), "F");
    } catch (error) {
      console.error(error);
    }
      */
  }

  /*useEffect(() => {
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
  }, []);*/

  return (
    <div
      className="modal fade"
      id="exportArchive"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
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
                disabled={loading || serverFlag}
              >
                Export
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
