import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute() {



  // ⏳ Wait until user is loaded
  
  // ❌ Not logged in
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  // ✅ Logged in
  return <Outlet />;
}