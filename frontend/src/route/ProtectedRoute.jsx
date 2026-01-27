import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
