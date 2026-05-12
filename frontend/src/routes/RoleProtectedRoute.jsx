import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  disallowedRoles = [],
  allowGuest = false,
  redirectTo = "/",
}) => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) return null;

  // ✅ guest handling
  if (!user) {
    return allowGuest ? children : <Navigate to="/login" replace />;
  }

  const role = user?.data?.role;

  if (disallowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleProtectedRoute;