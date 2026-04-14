import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — guards a route by checking localStorage token + role.
 *
 * Props:
 *   allowedRoles  — array of roles that may access this route, e.g. ["doctor"]
 *                   pass an empty array / omit to just require any auth.
 *   redirectTo    — where to send unauthenticated users (default: /signin)
 */
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = "/signin" }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // No token → force sign-in
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  // If specific roles are required, check the stored role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to the appropriate home based on role
    if (userRole === "doctor") return <Navigate to="/doctor/dashboard" replace />;
    if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
