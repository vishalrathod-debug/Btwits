import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../context/UserContext";


export default function ProtectedRoute() {

  // const token = localStorage.getItem("token")
  const{user,loading} = useContext(UserContext)


  // ⏳ Wait until user is loaded
  if(loading){
    return<h1>Loding ...</h1>
  }
  if(user==null){
    return <Navigate to={"/login"}></Navigate>
  }
  // ✅ Logged in
  return <Outlet />;

}