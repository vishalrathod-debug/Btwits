import { useNavigate } from "react-router-dom";

export default function Header({ toggleSidebar, user }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-sm">
      {/* Sidebar Toggle Button */}
      <button 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="rounded-lg p-2 text-xl font-semibold text-slate-600 transition-colors hover:bg-slate-100 active:scale-95"
      >
        ☰
      </button>

      {/* Page Title */}
      <h1 className="text-lg font-bold text-slate-800 md:text-xl">
        Dashboard
      </h1>

      {/* User Profile Avatar */}
      {user.avatar

      ? 
       <div className="h-8 w-8 rounded-full ring-2 ring-pink-500/80 p-0.5 overflow-hidden">
            <img src={user?.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
        </div>
        :<button
        onClick={() => navigate("/profile")}
        aria-label="View profile"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
      </button>
    }
          
          
      
    </header>
  );
}
