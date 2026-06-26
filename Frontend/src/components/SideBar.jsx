import { NavLink } from "react-router-dom";

export default function SideBar({ isOpen, setIsOpen, user, handleLogout }) {
  // Shared link styling logic for React Router NavLink active states
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700 font-semibold"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white p-5 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-black tracking-tight text-blue-600">
          Btwits
        </span>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
          className="rounded-lg p-1.5 hover:bg-gray-100 md:hidden"
        >
          ✕
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex-1 space-y-1">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-100 pt-4">
        <div className="mb-4 truncate text-xs font-medium text-gray-500">
          {user?.email || "No email available"}
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-red-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
