import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { createPost } from "../services/api";

function CreatePost() {
  const { user, loading } = useContext(UserContext);
  const [tweetText, setTweetText] = useState("");
  const [media, setMedia] = useState([]); // Initialized as an empty array
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <h1 className="text-sm font-medium text-gray-500">Loading profile...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="font-semibold text-gray-800 mb-2">Authentication Required</p>
          <p className="text-sm text-gray-500 mb-4">Please log in to share updates on your timeline.</p>
        </div>
      </div>
    );
  }

  const maxCharacters = 280;
  const remainingChars = maxCharacters - tweetText.length;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isImage && !isVideo) {
        alert("Only images/videos allowed");
        return;
      }

      validFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
        type: isVideo ? "video" : "image",
      });
    });

    setMedia((prev) => [...prev, ...validFiles]);
    
    // Reset file input so user can choose the same file again if deleted
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index) => {
    setMedia((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!tweetText.trim() && media.length === 0) return;
    if (tweetText.length > maxCharacters) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("content", tweetText.trim());

      if (media.length > 0) {
        media.forEach((m) => {
          formData.append("media", m.file);
        });
      }

      const newPost = await createPost(formData);

      // Cleanup preview URLs to prevent memory leaks
      media.forEach((m) => URL.revokeObjectURL(m.previewUrl));
      setMedia([]);
      setTweetText("");

      navigate("/", { state: { newPost }, replace: true });
    } catch (error) {
      console.error("Post failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // UI Helper: Calculates dynamic grid layouts depending on number of uploaded items
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    return "grid-cols-2 sm:grid-cols-3";
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50 min-h-screen text-gray-900 antialiased">
      <main className="p-4 md:p-6 max-w-2xl w-full mx-auto">
        
        {/* Navigation Action Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 active:text-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" className="fill-none stroke-current stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Feed
          </button>
          <h2 className="text-base font-bold text-gray-800">Compose Update</h2>
        </div>

        {/* Dynamic Compose Workspace Container */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-400">
          <div className="flex items-start gap-4">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
              alt={`${user?.username || 'User'}'s avatar`}
              className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
            />

            <form onSubmit={handlePostSubmit} className="flex-1 min-w-0">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What is happening on your workspace?!"
                rows="4"
                maxLength={maxCharacters}
                disabled={submitting}
                className="w-full bg-transparent text-base text-gray-800 placeholder-gray-400 outline-none resize-none border-b border-gray-100 focus:border-gray-200 p-0 pb-4 transition-colors disabled:opacity-60"
                autoFocus
              />

              {/* Media Asset Preview Frame (Responsive Masonry-lite Grid) */}
              {media.length > 0 && (
                <div className={`grid gap-2 mt-4 auto-rows-fr ${getGridClass(media.length)}`}>
                  {media.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex justify-center items-center group aspect-video max-h-64"
                    >
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        disabled={submitting}
                        className="absolute top-2 right-2 bg-gray-900/80 hover:bg-black text-white p-1.5 rounded-full z-10 transition-all shadow-md transform active:scale-95 disabled:opacity-50"
                        title="Remove media"
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" className="fill-current">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>

                      {item.type === "image" ? (
                        <img 
                          src={item.previewUrl} 
                          alt={`Upload preview ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <video 
                          src={item.previewUrl} 
                          controls 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Controller Toolbar */}
              <div className="flex justify-between items-center mt-4 pt-1">
                <div className="flex items-center">
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-xl transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                    title="Add Media (Image/Video)"
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" className="fill-none stroke-current stroke-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold tabular-nums tracking-wide ${remainingChars <= 20 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                    {remainingChars}
                  </span>

                  <button
                    type="submit"
                    disabled={(!tweetText.trim() && media.length === 0) || remainingChars < 0 || submitting}
                    className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting && (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    {submitting ? "Posting..." : "Post to Btwits"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePost;