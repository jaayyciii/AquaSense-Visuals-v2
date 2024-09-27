import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../AuthContext";

export default function ForgotPassword() {
  // sets a prompt when there is an error encountered when requesting for a reset
  const [requestError, setRequestError] = useState<string>("");
  // sets a prompt when user request has made success
  const [successfulPrompt, setSuccessfulPrompt] = useState<string>("");
  // loading value to disable buttons when requesting
  const [requestingReset, isRequestingReset] = useState<boolean>(false);
  // use state that holds the user email
  const [email, setEmail] = useState<string>("");
  // function for request password reset obtained from Auth Context
  const { requestPasswordReset } = useAuth();

  // handle reset function
  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setRequestError("");
      setSuccessfulPrompt("");
      isRequestingReset(true);
      await requestPasswordReset(email);
      setSuccessfulPrompt(
        "A password reset link has been sent to your email. Please check your inbox for further instructions"
      );
    } catch (error) {
      console.error(error);
      let errorMessage =
        "Failed to send password reset email. Please check your connection.";

      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-email")
          errorMessage =
            "No account found with this email. Are you sure that you've already registered?";
      }

      setRequestError(errorMessage);
    } finally {
      isRequestingReset(false);
    }
  }

  return (
    <div className="d-flex flex-column w-100">
      <div className="d-flex flex-column my-2 w-100">
        <h2 className="fw-bold" style={{ fontSize: "32px" }}>
          Forgot Password?
        </h2>
        <div style={{ fontSize: "12px" }}>
          <p className="d-inline text-muted">
            Enter the email associated with your account and we'll send an email
            with instructions to reset your password
          </p>
        </div>
      </div>
      <div className="d-flex flex-column my-3">
        {successfulPrompt && (
          <div
            className="alert alert-info text-justify"
            role="alert"
            style={{ fontSize: "13px" }}
          >
            {successfulPrompt}
          </div>
        )}
        <form onSubmit={(e) => handleReset(e)}>
          <div className="form-floating mb-4">
            <input
              type="email"
              className="form-control"
              id="float1"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="text-muted" htmlFor="float1">
              Email Address
            </label>
            {requestError && (
              <div className="my-1" style={{ fontSize: "13px", color: "red" }}>
                <i className="bi bi-exclamation-circle-fill" />
                <span className="ms-2">{requestError}</span>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center my-3">
            <button
              className="btn btn-primary w-75"
              type="submit"
              disabled={requestingReset}
            >
              Send Instructions
            </button>
          </div>
        </form>
        <p className="text-center" style={{ fontSize: "14px" }}>
          <a href="/" className="fw-medium text-primary text-decoration-none">
            Return to Log In
          </a>
        </p>
      </div>
    </div>
  );
}
