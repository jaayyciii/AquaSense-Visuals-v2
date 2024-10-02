import { useMemo } from "react";
import { useAuth } from "../AuthContext";
import UpdateProfile from "./UpdateProfile";
import logo from "../assets/logo.png";

type HeaderProps = {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  admin: boolean;
};

export default function Header({ setPrompt, admin }: HeaderProps) {
  // holds user credentials obtained from Auth Context
  const { currentUser } = useAuth();
  // Saves the initials from display name
  const initials: string = useMemo(() => {
    return (currentUser?.displayName ?? "Guest")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [currentUser]);

  return (
    <>
      <UpdateProfile initials={initials} setPrompt={setPrompt} admin={admin} />
      <div
        className="fixed-top bg-white shadow"
        style={{ height: "55px", width: "100%" }}
      >
        <div className="d-flex justify-content-between px-4 h-100 w-100">
          <div className="d-flex align-items-center">
            <img src={logo} alt="logo" style={{ width: "30px" }} />
            <span
              className="fw-bold ps-2 ms-2 d-none d-md-block"
              style={{ fontSize: "19px" }}
            >
              AquaSense Visuals
            </span>
          </div>
          <div
            className="d-flex align-items-center fw-bold ps-2 d-block d-md-none"
            style={{ fontSize: "20px" }}
          >
            AquaSense Visuals
          </div>
          <div className="d-flex align-items-center">
            <h6
              className="fw-medium mb-0 me-2 d-none d-md-block"
              style={{ fontSize: "15px" }}
            >
              {currentUser?.displayName ?? "Guest"}
            </h6>
            <div
              className="btn btn-sm d-flex justify-content-center align-items-center bg-primary rounded-circle text-white fw-medium"
              data-bs-toggle="modal"
              data-bs-target="#updateprofile"
              style={{
                height: "32px",
                width: "32px",
                fontSize: "16px",
              }}
            >
              {initials}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
