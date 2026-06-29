import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { updateUser } from "../services/api";

function Profile() {
  const { user, setUser } = useContext(UserContext);

  // States for file uploads
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialize state directly from context (No useEffect needed!)
  const [form, setForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.target); 

    if (avatarFile) formData.append("avatar", avatarFile);
    if (bannerFile) formData.append("banner", bannerFile);

    try {
      const updatedUser = await updateUser(formData);
      if (updatedUser) {
        setUser(updatedUser);
        setAvatarFile(null);
        setBannerFile(null);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
    <div className="flex-1 flex flex-col min-w-0">
      {/* 2. Using a 'key' here forces React to auto-reset the form if the user updates or changes */}
      <form onSubmit={handleSave} key={user?.id || "profile-form"} className="w-full">
        <main className="p-4 md:p-8 max-w-3xl w-full mx-auto space-y-6">
          
          {/* Header Section with Title and Save Button */}
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
              <p className="text-sm text-slate-500 hidden sm:block">Manage your public profile settings and credentials.</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm transition-all ${
                isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 active:scale-98"
              }`}
            >
              {isSubmitting ? "Saving changes..." : "Save changes"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* 🔵 Banner Area */}
            <div className="h-48 w-full relative bg-linear-to-br from-blue-100 via-indigo-50 to-amber-50 group border-b border-slate-100">
              {(bannerFile || user?.banner) && (
                <img
                  src={bannerFile ? URL.createObjectURL(bannerFile) : user?.banner}
                  className="h-full w-full object-cover"
                  alt="Profile Banner"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0] || null)}
                className="hidden"
                id="bannerUpload"
              />
              <button
                type="button"
                onClick={() => document.getElementById("bannerUpload").click()}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-sm hover:bg-white transition"
              >
                Change Banner
              </button>
            </div>

            {/* 🔵 Profile Header & Identity */}
            <div className="px-6 pb-6 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                
                {/* Avatar Wrapper with integrated file input trigger */}
                <div className="relative h-28 w-28 rounded-full bg-white p-1 shadow-md border border-slate-100 group">
                  <img
                    src={avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar || "https://img.magnific.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg?w=360"}
                    className="h-full w-full object-cover rounded-full"
                    alt="Profile Avatar"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0] || null)}
                    className="hidden"
                    id="avatarUpload"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("avatarUpload").click()}
                    className="absolute inset-1 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium"
                  >
                    Change Photo
                  </button>
                </div>

                <div className="text-center sm:text-left mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{form.username || "New User"}</h2>
                  <div className="flex items-center gap-3 mt-1 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => document.getElementById("avatarUpload").click()}
                      className="text-xs text-blue-600 font-medium hover:text-blue-700 transition"
                    >
                      Upload new
                    </button>
                    {(avatarFile || user?.avatar) && (
                      <>
                        <span className="h-3 w-px bg-slate-200" />
                        <button
                          type="button"
                          onClick={() => setAvatarFile(null)}
                          className="text-xs text-slate-500 font-medium hover:text-red-600 transition"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 🔵 Form Fields Container */}
            <div className="divide-y divide-slate-100">
              
              {/* Username Field */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 p-6 items-center">
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Bio Field */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 p-6 items-start">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-slate-700">Bio</label>
                  <p className="text-xs text-slate-400 max-w-50">A brief description for your profile dashboard.</p>
                </div>
                <div className="md:col-span-2">
                  <textarea
                    name="bio"
                    rows="4"
                    value={form.bio}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

            </div>

          </div>
        </main>
      </form>
    </div>
  </div>
);

}

export default Profile;