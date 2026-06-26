import { useState, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      
      {/* Sidebar */}
      <SideBar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Header */}
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}