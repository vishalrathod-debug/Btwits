import{ useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
  // Mock initial state for the user details
  const [profile, setProfile] = useState({
    username: "Sasha Zvereva",
    website: "https://taplink.cc",
    bio: "Software developer & UI designer based in Los Angeles.",
    followers: "2.1m",
    following: "116",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    banner: "linear-gradient(to bottom right, #bfdbfe, #fef08a)" 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saved Data:", profile);
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-slate-200 bg-white p-6 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2 py-1 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600 shadow-sm flex items-center justify-center text-white font-bold">T</div>
          <span className="text-xl font-black tracking-tight text-blue-600">Btwits</span>
        </div>
        <nav className="space-y-1">
          {["My Profile", "Settings", "Plan", "Team", "Notifications", "Integrations", "API"].map((item) => (
            <button
              key={item}
              type="button"
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item === "My Profile" 
                  ? "bg-slate-100 text-slate-900 font-semibold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <button onClick={()=>navigate("/")} type="button" className="text-slate-900 font-semibold border-b-2 border-blue-600 h-16 px-1 flex items-center">Home</button>
            <button type="button" className="hover:text-slate-900 h-16 flex items-center">Dashboard</button>
            <button type="button" className="hover:text-slate-900 h-16 flex items-center">Projects</button>
            <button type="button" className="hover:text-slate-900 h-16 flex items-center">Tasks</button>
          </div>
          {/* Small Profile Ring Avatar Header Anchor */}
          <div className="h-8 w-8 rounded-full ring-2 ring-pink-500/80 p-0.5 overflow-hidden">
            <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
          </div>
        </header>

        {/* Form Work Area */}
        <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Card Presentation Frame */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Visual Cover Banner with Top Action Overlay */}
            <div className="h-44 w-full relative bg-linear-to-br from-blue-200 to-amber-100">
              <button type="button" className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-xs p-2 rounded-lg text-slate-600 transition-colors shadow-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
            </div>

            {/* Asymmetric Profile Metadata Row */}
            <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100">
              
              {/* Stacked Floating Ring Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                <div className="relative h-32 w-32 rounded-full bg-white p-1 shadow-md ring-4 ring-linear-to-tr from-amber-400 via-pink-500 to-purple-600">
                  <img src={profile.avatar} alt="Profile Avatar" className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="text-center sm:text-left mb-2">
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                    {profile.username}
                    <span className="inline-flex text-blue-500">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z"/>
                      </svg>
                    </span>
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">Update your photo and personal credentials</p>
                </div>
              </div>

              {/* Stats & Actions Area */}
              <div className="flex flex-col items-center sm:items-end gap-3">
                <div className="flex gap-6 text-center sm:text-right text-sm py-1">
                  <div>
                    <span className="block font-bold text-slate-800">{profile.followers}</span>
                    <span className="text-xs text-slate-400 font-medium">followers</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">{profile.following}</span>
                    <span className="text-xs text-slate-400 font-medium">following</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-xs active:scale-98">Chat</button>
                  <button onClick={handleSave} type="submit" className="px-5 py-2 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md active:scale-98">Save changes</button>
                </div>
              </div>

            </div>

            {/* Structured Settings Input Rows */}
            <form onSubmit={handleSave} className="divide-y divide-slate-100 text-sm">
              
              {/* Row 1: Username */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 items-center">
                <label htmlFor="username" className="font-semibold text-slate-700">Username</label>
                <div className="md:col-span-2">
                  <input 
                    id="username"
                    type="text" 
                    name="username" 
                    value={profile.username} 
                    onChange={handleInputChange}
                    className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs transition-colors focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Website */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 items-center">
                <label htmlFor="website" className="font-semibold text-slate-700">Website</label>
                <div className="md:col-span-2">
                  <input 
                    id="website"
                    type="url" 
                    name="website" 
                    value={profile.website} 
                    onChange={handleInputChange}
                    className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs transition-colors focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Actionable Avatar Management Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 items-center">
                <div>
                  <span className="font-semibold text-slate-700 block">Your Photo</span>
                  <span className="text-xs text-slate-400">This will be displayed on your profile.</span>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={profile.avatar} alt="Current Avatar Thumbnail" className="h-full w-full object-cover" />
                  </div>
                  <button type="button" className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">Delete</button>
                  <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Update image</button>
                </div>
              </div>

              {/* Row 4: Bio Textarea */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 items-start">
                <div>
                  <label htmlFor="bio" className="font-semibold text-slate-700 block">Your Bio</label>
                  <span className="text-xs text-slate-400">Write a short introduction.</span>
                </div>
                <div className="md:col-span-2">
                  <textarea 
                    id="bio"
                    name="bio" 
                    rows="4" 
                    value={profile.bio} 
                    onChange={handleInputChange}
                    className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs transition-colors focus:border-blue-500 focus:outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
              
            </form>
          </div>
          
        </main>
      </div>
    </div>
  );
}
export default Profile