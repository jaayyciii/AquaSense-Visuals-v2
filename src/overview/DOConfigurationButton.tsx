import DOPortConfiguration from "./DOPortConfiguration";
import type { PortListType } from "../home/HomeLayout";

// component props
export type DOConfigurationProps = {
  portList: PortListType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
  admin: boolean;
};

export default function DOConfigurationButton({
  portList,
  setPrompt,
  disable,
  admin,
}: DOConfigurationProps) {
  return (
    <>
      {/* Port Configuration Modal */}
      <DOPortConfiguration
        portList={portList}
        setPrompt={setPrompt}
        disable={disable || !admin}
        admin={admin}
      />
      {/* Port Configuration Button */}
      {admin && (
        <button
          className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
          data-bs-toggle="modal"
          data-bs-target="#DOPortConfiguration"
          style={{ height: "35px" }}
          disabled={disable || !admin}
        >
          <i className="bi bi-gear" style={{ fontSize: "16px" }} />
        </button>
      )}
    </>
  );
}
