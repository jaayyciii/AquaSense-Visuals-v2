import { Route, Routes } from "react-router-dom";
import BrokenURL from "../BrokenURL";
import LogInLayout from "./LogInLayout";
import LogIn from "./LogIn";
import ForgotPassword from "./ForgotPassword";
import RegisterPage from "./RegisterPage";

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="/" element={<LogInLayout />}>
        <Route index element={<LogIn />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
      </Route>
      <Route path="/register" element={<RegisterPage />} />
      {/* ERROR 404 CATCH */}
      <Route path="*" element={<BrokenURL />} />
    </Routes>
  );
}
