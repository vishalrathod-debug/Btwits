import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Routes>
      
      {/* Protected Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Public routes */}
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
}

export default App