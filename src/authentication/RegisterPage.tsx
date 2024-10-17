import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../AuthContext";
import logo from "../assets/logo.png";
import background from "../assets/background.png";

// typescript data types
type RegisterationDetailsType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  // sets a prompt whenever passwords don't match or too weak
  const [passwordError, setPasswordError] = useState<string>("");
  // sets a prompt when there is an error encountered on registration
  const [registrationError, setRegistrationError] = useState<string>("");
  // loading value to disable buttons when requesting
  const [creatingAccount, isCreatingAccount] = useState<boolean>(false);
  // use state that holds user registration details
  const [registerationDetails, setRegisterDetails] =
    useState<RegisterationDetailsType>({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  const navigate = useNavigate();
  // function for user registration obtained from Auth Context
  const { register } = useAuth();

  // handle user registration, this also sets the user's display name
  async function handleRegistration(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { username, email, password, confirmPassword } = registerationDetails;
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError(
        "Passwords do not match. Please re-enter your password and try again."
      );
      return;
    }
    if (password.length < 6) {
      setPasswordError(
        "Your password is too weak. It must be at least 6 characters long."
      );
      return;
    }

    try {
      setRegistrationError("");
      isCreatingAccount(true);
      await register(username, email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      let errorMessage =
        "Oops! We couldn't create your account. Please check your connection.";

      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-email")
          errorMessage =
            "The email address you entered is invalid. Please check and try again";
        if (error.code === "auth/email-already-in-use")
          errorMessage =
            "The email address you entered is already associated with an account. Please try a different email or log in.";
      }

      setRegistrationError(errorMessage);
    } finally {
      isCreatingAccount(false);
    }
  }

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div
        className="d-flex flex-grow-1 w-50 h-100 d-none d-sm-block"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="d-flex flex-grow-1 w-100 h-100 px-2 px-sm-5 py-3">
        <div className="d-flex flex-column w-100 mx-3">
          <div className="d-flex align-items-end mb-4">
            <img src={logo} alt="logo" style={{ width: "30px" }} />
            <span className="ms-3 fw-bold" style={{ fontSize: "20px" }}>
              AquaSense Visuals
            </span>
          </div>
          <div className="d-flex flex-column flex-grow-1 justify-content-center">
            <div className="d-flex flex-column">
              <div className="d-flex flex-column my-2">
                <h2 className="fw-bold" style={{ fontSize: "32px" }}>
                  Create Account.
                </h2>
                <div style={{ fontSize: "12px" }}>
                  <p className="d-inline text-muted">
                    By clicking "Sign Up," you acknowledge that you have read
                    and understood our Terms and Conditions.
                  </p>
                </div>
              </div>
              <div className="d-flex flex-column flex-grow-1 my-2">
                {registrationError && (
                  <div
                    className="alert alert-info text-justify"
                    role="alert"
                    style={{ fontSize: "13px" }}
                  >
                    {registrationError}
                  </div>
                )}
                <form onSubmit={(e) => handleRegistration(e)}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="float0"
                      value={registerationDetails.username}
                      placeholder="Enter your account name"
                      onChange={(e) =>
                        setRegisterDetails({
                          ...registerationDetails,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                    <label className="text-muted" htmlFor="float0">
                      Account Name
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="float1"
                      value={registerationDetails.email}
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setRegisterDetails({
                          ...registerationDetails,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <label className="text-muted" htmlFor="float1">
                      Email Address
                    </label>
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="form-floating flex-grow-1">
                      <input
                        type="password"
                        className={`form-control ${
                          passwordError ? "border-danger" : ""
                        }`}
                        id="float2"
                        value={registerationDetails.password}
                        placeholder="••••••••"
                        onChange={(e) =>
                          setRegisterDetails({
                            ...registerationDetails,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <label className="text-muted" htmlFor="float2">
                        Password
                      </label>
                    </div>
                    <div className="form-floating flex-grow-1">
                      <input
                        type="password"
                        className={`form-control ${
                          passwordError ? "border-danger" : ""
                        }`}
                        id="float3"
                        value={registerationDetails.confirmPassword}
                        placeholder="••••••••"
                        onChange={(e) =>
                          setRegisterDetails({
                            ...registerationDetails,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <label className="text-muted" htmlFor="float3">
                        Confirm Password
                      </label>
                    </div>
                  </div>
                  {passwordError && (
                    <div
                      className="my-1"
                      style={{ fontSize: "13px", color: "red" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="ms-2">{passwordError}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-center mt-4 mb-3">
                    <button
                      className="btn btn-primary w-75"
                      type="submit"
                      disabled={creatingAccount}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
                <p className="text-center" style={{ fontSize: "14px" }}>
                  Already have an account?{" "}
                  <a
                    href="/"
                    className="fw-medium text-primary text-decoration-none"
                  >
                    Log In
                  </a>
                </p>
              </div>
            </div>
          </div>
          <footer
            className="d-flex justify-content-between"
            style={{ fontSize: "12px" }}
          >
            <div className="text-muted">© 2024 All rights reserved.</div>
            <div>
              <a href="#" className="text-muted text-decoration-none me-2">
                Terms & Conditions
              </a>
              <a href="#" className="text-muted text-decoration-none">
                About
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
