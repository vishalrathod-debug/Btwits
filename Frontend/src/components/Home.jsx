
import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../context/useUser";


export default function HomePage() {

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const { user, logout } = useUser();

  console.log(user?.email);

  
  
  if (!user) {
  navigate("/login");
  return null;
  }

  const handleLogout = () => {
    logout()
    navigate("/login");
  };



  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      
      {/* Sidebar - Collapsible on Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-gray-200 bg-white p-5 transition-transform md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-blue-600">Btwits</span>
          <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-gray-100 md:hidden">
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            Overview
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Analytics
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Projects
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Settings
          </a>
        </nav>

        {/* User Footer inside Sidebar */}
        <div className="border-t border-gray-100 pt-4">
          <div className="mb-4 truncate text-xs font-medium text-gray-500">{user.email}</div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold shadow-xs transition-all hover:bg-gray-50 hover:text-red-600 active:scale-98"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-lg p-2 hover:bg-gray-100 md:hidden">
              ☰
            </button>
            <h1 className="text-lg font-bold tracking-tight">Dashboard Overview</h1>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white uppercase">
            {user?.username?.charAt(0)}
          </div>
        </header>

        {/* Dashboard Body Metrics Container */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-md md:p-8">
            <h2 className="text-2xl font-bold md:text-3xl">Welcome back to Btwits! {user?.username}</h2>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              Your platform metrics are stable. You have 4 pending design reviews and 2 API deployment notifications waiting.
            </p>
          </div>

          {/* Grid Layout Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Revenue</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">$24,500</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">+12%</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Sessions</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">1,482</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">+4%</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Conversion Rate</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">2.84%</span>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md">-0.5%</span>
              </div>
            </div>

          </div>

          {/* Recent Activity Table Asset */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="font-bold">Recent Workspace Updates</h3>
            </div>
            <div className="p-6 text-center text-sm text-gray-500">
              No recent critical system log events to show. Everything is running smoothly.
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}
