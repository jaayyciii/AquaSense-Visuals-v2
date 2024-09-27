import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import type { UserCredentialsType } from "../AuthContext";
import { FirebaseError } from "firebase/app";

export default function LogIn() {
  // sets a prompt when there is an error encountered when logging in
  const [loginError, setLoginError] = useState<string>("");
  // loading value to disable buttons when logging in
  const [loggingIn, isLoggingIn] = useState<boolean>(false);
  // use state that holds user credentials
  const [credentials, setCredentials] = useState<UserCredentialsType>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  // functions for log in and log out reset obtained from Auth Context
  const { login, logout } = useAuth();

  // handle log in function and navigates to home upon success
  // logs out the user when email has not been verified
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { email, password } = credentials;

    try {
      setLoginError("");
      isLoggingIn(true);
      const userCredential = await login(email, password);

      const user = userCredential.user;
      await user.reload();
      if (!user.emailVerified) {
        await logout();
        setLoginError("Please verify your email before logging in.");
        return;
      }
      navigate("/home");
    } catch (error) {
      console.error(error);
      let errorMessage =
        "Oops! Something went wrong while logging in. Please check your connection.";

      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential")
          errorMessage =
            "Email or password incorrect. Please try again or reset your password.";
      }

      setLoginError(errorMessage);
    } finally {
      isLoggingIn(false);
    }
  }

  return (
    <div className="d-flex flex-column w-100">
      <div className="d-flex flex-column my-2">
        <h2 className="fw-bold" style={{ fontSize: "32px" }}>
          Log in.
        </h2>
        <div style={{ fontSize: "16px" }}>
          <p className="d-inline fw-medium text-primary">Hello there!</p>
          <p className="d-inline text-muted ms-1">Ready to Farm?</p>
        </div>
      </div>
      <div className="d-flex flex-column my-3">
        <form onSubmit={(e) => handleLogin(e)}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control ${loginError ? "border-danger" : ""}`}
              id="float1"
              value={credentials.email}
              placeholder="Enter your email address"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value,
                })
              }
              required
            />
            <label className="text-muted" htmlFor="float1">
              Email Address
            </label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="password"
              className={`form-control ${loginError ? "border-danger" : ""}`}
              id="float2"
              value={credentials.password}
              placeholder="••••••••"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
              required
            />
            <label className="text-muted" htmlFor="float2">
              Password
            </label>
            {loginError && (
              <div className="my-1" style={{ fontSize: "13px", color: "red" }}>
                <i className="bi bi-exclamation-circle-fill" />
                <span className="ms-2">{loginError}</span>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end mb-4">
            <a
              href="/forgotpassword"
              className="text-primary text-decoration-none small"
            >
              Forget password?
            </a>
          </div>
          <div className="d-flex justify-content-center my-3">
            <button
              className="btn btn-primary w-75"
              type="submit"
              disabled={loggingIn}
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center" style={{ fontSize: "14px" }}>
          Don't have an account?{" "}
          <a
            href="/register"
            className="fw-medium text-primary text-decoration-none"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
