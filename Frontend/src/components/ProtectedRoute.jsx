import { Navigate, Outlet } from "react-router-dom";
import useUser from "../context/useUser";


export default function ProtectedRoute() {
  const { user } = useUser();

  // If not logged in → redirect
  if (!user) {
    console.log("navigating to login")
    return <Navigate to="/login" replace />;
  }

  // If logged in → show child routes
  return <Outlet />;
}