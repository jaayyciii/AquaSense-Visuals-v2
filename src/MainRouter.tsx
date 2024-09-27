import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import AuthRouter from "./authentication/AuthRouter";
import HomeRouter from "./home/HomeRouter";
import PrivateRoute from "./PrivateRoute";

export default function MainRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<AuthRouter />} />
          <Route path="/home/*" element={<PrivateRoute />}>
            <Route path="*" element={<HomeRouter />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
