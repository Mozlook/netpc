import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Gate for routes that require login. UI-only: the backend still enforces auth per request.
function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Wait for the initial session check so a refresh doesn't bounce a logged-in user.
  if (status === "loading") {
    return <p className="text-gray-500">Ładowanie...</p>;
  }

  if (status !== "authenticated") {
    // Remember where we were headed so login can send us back (LoginPage reads state.from).
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
