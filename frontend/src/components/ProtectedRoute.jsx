// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check if user logged in

  if (!token) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }

  return children; // otherwise show the page
};

export default ProtectedRoute;
