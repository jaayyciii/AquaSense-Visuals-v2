import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute() {
  const { currentUser } = useAuth();

  // this wrapper redirects the user back to the log in page,
  // when there is no current user logged in
  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
