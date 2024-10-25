import { ArchiveType, PortArchivesType } from "../home/DataArchivePanel";

type PortArchiveProps = {
  portName: string;
  retrievingArchive: boolean;
  portArchives: PortArchivesType;
  setExportArchive: React.Dispatch<
    React.SetStateAction<ArchiveType | undefined>
  >;
};

export default function PortArchive({
  portName,
  retrievingArchive,
  portArchives,
  setExportArchive,
}: PortArchiveProps) {
  const portIndex = portArchives.portIndex;
  const portArchiveList = portArchives.portArchives;

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className="accordion-button fw-medium"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#port${String.fromCharCode(65 + portIndex)}`}
        >
          <span style={{ fontSize: "18px" }}>Sensor {portName}</span>
        </button>
      </h2>
      <div
        id={`port${String.fromCharCode(65 + portIndex)}`}
        className={`accordion-collapse collapse ${
          portIndex == 0 ? "show" : ""
        }`}
        data-bs-parent="#portArchive"
      >
        {!retrievingArchive && (
          <div
            className="accordion-body px-3"
            style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="fw-medium fs-6 col-1" scope="col">
                    ID
                  </th>
                  <th className="fw-medium fs-6 col-2" scope="col">
                    Sensor Type
                  </th>
                  <th className="fw-medium fs-6 col-2" scope="col">
                    Range
                  </th>
                  <th className="fw-medium fs-6 col-2" scope="col">
                    Threshold
                  </th>
                  <th className="fw-medium fs-6 col-4" scope="col">
                    Active Date
                  </th>
                  <th className="fw-medium fs-6 col-1" scope="col" />
                </tr>
              </thead>
              <tbody
                className="table-group-divider"
                style={{ fontSize: "14px" }}
              >
                {portArchiveList.length > 0 ? (
                  portArchiveList.map((archive) => (
                    <tr key={archive.id}>
                      <td>{archive.id}</td>
                      <td>{archive.define}</td>
                      <td>{`${archive.range[0]} ${archive.unit} - ${archive.range[1]} ${archive.unit}`}</td>
                      <td>{`${archive.threshold[0]} ${archive.unit} - ${archive.threshold[1]} ${archive.unit}`}</td>
                      <td>
                        {`${archive.date[0].toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} - 
                        ${archive.date[1].toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm py-0"
                          data-bs-toggle="modal"
                          data-bs-target="#exportArchive"
                          onClick={() => setExportArchive(archive)}
                        >
                          <i
                            className="bi bi-file-earmark-arrow-down"
                            style={{ fontSize: "16px" }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-3 text-center text-muted">
                      No Archives Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
