import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  const valid =
    token &&
    expiry &&
    !Number.isNaN(parseInt(expiry, 10)) &&
    Date.now() < parseInt(expiry, 10);

  return valid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
