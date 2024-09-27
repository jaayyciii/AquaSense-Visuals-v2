import ConfirmDelete from "./ConfirmDelete.tsx";

// component props
export type DeleteProps = {
  portIndex: number;
  name: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
};

export default function DeleteButton({
  portIndex,
  name,
  setPrompt,
  disable,
}: DeleteProps) {
  return (
    <>
      {/* Confirm Delete Modal */}
      <ConfirmDelete
        portIndex={portIndex}
        name={name}
        setPrompt={setPrompt}
        disable={disable}
      />
      {/* Delete Button */}
      <button
        type="button"
        className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
        data-bs-toggle="modal"
        data-bs-target="#deletePort"
        style={{ height: "35px" }}
        disabled={disable}
      >
        <i className="bi bi-trash3" style={{ fontSize: "16px" }} />
      </button>
    </>
  );
}
