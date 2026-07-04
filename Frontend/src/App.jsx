import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import CreatePost from "./components/createPost";
import UserProfile from "./components/UserProfile";
import Search from "./components/Search";


function App() {
  return (
    <Routes>
      
      {/* Protected Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<CreatePost />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:id" element={<UserProfile/>} />
        </Route>
      </Route>

      {/* Public routes */}
      
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />

    </Routes>
  );
}

export default App