import {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { 
  getAllPosts, 
  toggleLike, 
  toggleFollow, 
  getComments, 
  addComment 
} from "../services/api";
import CommentSection from "./commentSection";

function Home() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);

  const observer = useRef();

  // 🔥 FETCH POSTS
  const fetchPosts = useCallback(async (pageToFetch) => {
    try {
      setLoadingPosts(true);
      const data = await getAllPosts(pageToFetch, 10);
      
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setHasMore(data.hasMore);
      setPage(pageToFetch + 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    if (!user || posts.length > 0) return;
    fetchPosts(1);
  }, [user, fetchPosts, posts.length]);

  // 🔥 INFINITE SCROLL
  const lastPostRef = useCallback(
    (node) => {
      if (loadingPosts) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingPosts, hasMore, fetchPosts, page]
  );

  // 🔥 LIKE HANDLER (Optimistic Update)
  const handleLike = async (postId) => {
    const toggleLikeState = (list) =>
      list.map((p) =>
        p._id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      );

    setPosts((prev) => toggleLikeState(prev));

    try {
      await toggleLike(postId);
    } catch (err) {
      console.error("Like error:", err);
      setPosts((prev) => toggleLikeState(prev)); // Revert state on failure
    }
  };

  // 🔥 FOLLOW HANDLER (Optimistic Update)
  const handleFollow = async (targetUserId) => {
    const toggleFollowState = (list) =>
      list.map((p) =>
        p.user?._id === targetUserId
          ? { ...p, user: { ...p.user, isFollowed: !p.user.isFollowed } }
          : p
      );

    setPosts((prev) => toggleFollowState(prev));

    try {
      await toggleFollow(targetUserId);
    } catch (err) {
      console.error("Follow error:", err);
      setPosts((prev) => toggleFollowState(prev)); // Revert state on failure
    }
  };

  // 🎨 UI HELPER: Dynamic Media Grid
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    return "grid-cols-2 sm:grid-cols-3";
  };

  // 🔐 AUTH GUARD
  if (!user && !loading) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full shadow-sm" />
          <p className="text-gray-500 font-medium">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen p-4 sm:p-6 antialiased">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* HEADER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center sticky top-4 z-10 backdrop-blur-md">
          <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">Home Feed</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text font-bold">
                @{user.username}
              </span>
            </span>
            {user.avatar && (
              <img src={user.avatar} alt="You" className="w-8 h-8 rounded-full border border-gray-200" />
            )}
          </div>
        </div>

        {/* POSTS LIST */}
        <div className="space-y-4">
          {posts.map((post, index) => {
            const isLast = index === posts.length - 1;
            const isOwnPost = post.user?._id === user._id; 
            const isCommentsOpen = expandedPostId === post._id;

            return (
              <div
                key={post._id}
                ref={isLast ? lastPostRef : null}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                {/* USER INFO & FOLLOW BUTTON */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user?.avatar || "https://via.placeholder.com/40"}
                      alt={post.user?.username}
                      onClick={() => navigate(`/profile/${post.user?._id}`)}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-50 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    <div className="flex flex-col">
                      <p 
                        onClick={() => navigate(`/profile/${post.user?._id}`)}
                        className="font-bold text-gray-900 text-[15px] hover:underline cursor-pointer"
                      >
                        {post.user?.username}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {!isOwnPost && (
                    <button
                      onClick={() => handleFollow(post.user?._id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                        post.user?.isFollowed
                          ? "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-600 border border-transparent"
                          : "bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-sm"
                      }`}
                    >
                      {post.user?.isFollowed ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                {/* CONTENT */}
                <p className="mb-4 text-gray-800 leading-relaxed text-[15px] whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* MEDIA LAYOUT */}
                {post.media?.length > 0 && (
                  <div className="mb-4">
                    {post.media.length === 1 ? (
                      <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50/50 flex items-center justify-center max-h-[600px]">
                        {post.media[0].type === "video" || (typeof post.media[0] === 'string' && post.media[0].match(/\.(mp4|webm|ogg)$/)) ? (
                          <video
                            src={post.media[0].url || post.media[0]}
                            controls
                            className="w-full h-full max-h-150 object-contain bg-black"
                          />
                        ) : (
                          <img
                            src={post.media[0].url || post.media[0]}
                            alt="Post media"
                            className="w-full h-auto max-h-150 object-contain"
                          />
                        )}
                      </div>
                    ) : (
                      <div className={`grid gap-1 ${getGridClass(post.media.length)} rounded-xl overflow-hidden border border-gray-100`}>
                        {post.media.map((m, i) => (
                          <div key={i} className="bg-gray-100 aspect-square flex items-center justify-center relative group">
                            {m.type === "video" || (typeof m === 'string' && m.match(/\.(mp4|webm|ogg)$/)) ? (
                              <video
                                src={m.url || m}
                                controls
                                className="w-full h-full object-cover bg-black"
                              />
                            ) : (
                              <img
                                src={m.url || m}
                                alt={`Post media ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-6 mt-2 pt-3 border-t border-gray-50">
                  {/* LIKE BUTTON */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-2 group transition-colors"
                  >
                    <div className={`p-2 rounded-full transition-colors ${post.isLiked ? "bg-red-50" : "group-hover:bg-pink-50"}`}>
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        className={`transition-transform transform active:scale-75 ${
                          post.isLiked ? "fill-red-500 stroke-red-500" : "fill-transparent stroke-gray-500 group-hover:stroke-pink-500"
                        } stroke-2`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${post.isLiked ? "text-red-500" : "text-gray-500 group-hover:text-pink-500"}`}>
                      {post.likesCount || 0}
                    </span>
                  </button>

                  {/* COMMENT BUTTON */}
                  <button 
                    onClick={() => setExpandedPostId(isCommentsOpen ? null : post._id)}
                    className="flex items-center gap-2 group transition-colors"
                  >
                    <div className={`p-2 rounded-full transition-colors ${isCommentsOpen ? "bg-blue-50" : "group-hover:bg-blue-50"}`}>
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        className={`stroke-2 ${
                          isCommentsOpen 
                            ? "fill-blue-100 stroke-blue-500" 
                            : "fill-transparent stroke-gray-500 group-hover:stroke-blue-500"
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${isCommentsOpen ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"}`}>
                      {post.commentsCount || 0}
                    </span>
                  </button>
                </div>

                {/* EXPANDABLE COMMENT SECTION BLOCK */}
                {isCommentsOpen && (
                  <CommentSection
                    postId={post._id}
                    navigate={navigate}
                    onCommentAdded={() => {
                      setPosts(prev => prev.map(p => p._id === post._id ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
                    }}
                  />
                )}

              </div>
            );
          })}
        </div>

        {/* LOADING INDICATOR */}
        {loadingPosts && (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* END OF FEED */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center pb-8 pt-4">
            <p className="text-sm font-medium text-gray-400 bg-gray-100 inline-block px-4 py-1 rounded-full">
              You've caught up entirely! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default Home;