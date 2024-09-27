import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import PortArchive from "../dataarchive/PortArchive";
import ExportArchive from "../dataarchive/ExportArchive";
import type { ContextType } from "./HomeLayout";
import { onValue, ref } from "firebase/database";
import { db } from "../FirebaseConfig";

export type ArchiveType = {
  id: string;
  date: [Date, Date];
  define: string;
  range: [number, number];
  threshold: [number, number];
  unit: string;
};

export type PortArchivesType = {
  portIndex: number;
  portArchives: ArchiveType[];
};

export default function DataArchivePanel() {
  const { portListLoading, portList, setPrompt } =
    useOutletContext<ContextType>();
  const [deviceArchives, setDeviceArchives] = useState<PortArchivesType[]>([]);
  const [retrievingArchive, isRetrievingArchive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exportArchive, setExportArchive] = useState<ArchiveType | undefined>();

  useEffect(() => {
    isRetrievingArchive(true);
    const unsubscribe = onValue(ref(db, "Archive/"), (snapshot) => {
      try {
        if (snapshot.exists()) {
          const devicePortArchives = Object.values(snapshot.val());
          const devicePortIndices = Object.keys(snapshot.val());
          const newDeviceArchives: any = devicePortArchives.map(
            (portArchives: any, index: number) => {
              const portArchiveIDS = Object.keys(portArchives);
              let newPortArchives: ArchiveType[] = [];
              if (portArchives.length > 0) {
                newPortArchives = portArchives.map(
                  (portArchive: any, index: number) => {
                    return {
                      id: portArchiveIDS[index],
                      date: [
                        new Date(portArchive.date.start),
                        new Date(portArchive.date.end),
                      ],
                      define: portArchive.define,
                      range: [portArchive.range.min, portArchive.range.max],
                      threshold: [
                        portArchive.threshold.min,
                        portArchive.threshold.max,
                      ],
                      unit: portArchive.unit,
                    };
                  }
                );
              }
              return {
                portIndex: devicePortIndices[index],
                portArchives: newPortArchives,
              };
            }
          );
          setDeviceArchives(newDeviceArchives);
          isRetrievingArchive(false);
        }
      } catch (error) {
        console.error(error);
        setPrompt(
          "Oops! Unable to obtain device archives. Please check your connection and try again."
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ExportArchive exportArchive={exportArchive} setPrompt={setPrompt} />
      <div className="d-flex flex-column flex-grow-1 pb-3 px-4">
        <div className="d-flex flex-wrap justify-content-between mt-4">
          <h4>Data Archive</h4>
          <div className="input-group w-50 w-sm-100">
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
        {/* Desktop Accordion */}
        <div className="bg-white shadow mt-3 d-none d-md-block">
          <div className="accordion " id="portArchive">
            {!portListLoading &&
              deviceArchives.map((portArchives) => (
                <PortArchive
                  key={portArchives.portIndex}
                  portName={portList[portArchives.portIndex].name}
                  retrievingArchive={retrievingArchive}
                  portArchives={portArchives}
                  setExportArchive={setExportArchive}
                />
              ))}
          </div>
        </div>
        {/* Mobile Accordion */}
        <div className="d-flex justify-content-center w-100 mt-3 d-md-none">
          <div
            className="bg-white shadow accordion"
            id="portArchive"
            style={{ maxWidth: "366px", overflowX: "hidden" }}
          >
            {!portListLoading &&
              deviceArchives.map((portArchives) => (
                <PortArchive
                  key={portArchives.portIndex}
                  portName={portList[portArchives.portIndex].name}
                  retrievingArchive={retrievingArchive}
                  portArchives={portArchives}
                  setExportArchive={setExportArchive}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
