import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { 
  getUserProfile, 
  toggleFollow, 
  getFollowers, 
  getFollowing,
  toggleLike,
  getComments,
  addComment
} from "../services/api";

function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // 👥 CONNECTION MODAL STATES
  const [activeModal, setActiveModal] = useState(null); // 'followers' | 'following' | null
  const [modalDataList, setModalDataList] = useState([]);
  const [loadingModalData, setLoadingModalData] = useState(false);

  // 📝 TARGET DETAILED POST MODAL STATES
  const [selectedPost, setSelectedPost] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Reset modal states when user changes profile context
  useEffect(() => {
    setActiveModal(null);
    setSelectedPost(null);
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const data = await getUserProfile(id);
        const userData = data.user || data;

        setProfile(userData);
        setIsFollowing(data.isFollowing || false);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // 🔥 FOLLOW ACTION
  const handleFollow = async () => {
    const prevState = isFollowing;
    setIsFollowing(!prevState);
    setProfile(prev => ({
      ...prev,
      followersCount: prevState ? Math.max(0, (prev.followersCount || 1) - 1) : (prev.followersCount || 0) + 1
    }));

    try {
      const res = await toggleFollow(id);
      setIsFollowing(res.isFollowing);
    } catch (err) {
      console.error("Follow error:", err);
      setIsFollowing(prevState);
      setProfile(prev => ({
        ...prev,
        followersCount: prevState ? (prev.followersCount || 0) + 1 : Math.max(0, (prev.followersCount || 1) - 1)
      }));
    }
  };

  // 👥 FETCH RELATIONSHIP LISTS FROM ENDPOINTS
  const handleOpenRelations = async (type) => {
    setActiveModal(type);
    setLoadingModalData(true);
    try {
      let data;
      if (type === "followers") {
        data = await getFollowers(id);
      } else {
        data = await getFollowing(id);
      }
      setModalDataList(data?.users || data?.followers || data?.following || data || []);
    } catch (err) {
      console.error(`Error loading ${type}:`, err);
      setModalDataList([]);
    } finally {
      setLoadingModalData(false);
    }
  };

  // 💬 CLICK POST: OPEN DETAILED INSPECTOR & LOAD COMMENTS
  const handleOpenPostDetails = async (post) => {
    setSelectedPost(post);
    setLoadingComments(true);
    setPostComments([]);
    try {
      const data = await getComments(post._id);
      setPostComments(data?.comments || data || []);
    } catch (err) {
      console.error("Error fetching post commentary details:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  // ❤️ LIKE DETAILED POST INSIDE MODAL
  const handleLikePostDetails = async (postId) => {
    if (!selectedPost) return;
    
    const wasLiked = selectedPost.isLiked;
    // Optimistically update the selectedPost state view wrapper
    setSelectedPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likesCount: prev.isLiked ? Math.max(0, (prev.likesCount || 1) - 1) : (prev.likesCount || 0) + 1
    }));

    // Update inside profile posts stream array too so underlying matrix updates synchronously
    setProfile(prev => ({
      ...prev,
      posts: prev.posts.map(p => p._id === postId ? {
        ...p,
        isLiked: !p.isLiked,
        likesCount: p.isLiked ? Math.max(0, (p.likesCount || 1) - 1) : (p.likesCount || 0) + 1
      } : p)
    }));

    try {
      await toggleLike(postId);
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert if API fails
      setSelectedPost(prev => ({
        ...prev,
        isLiked: wasLiked,
        likesCount: wasLiked ? (prev.likesCount || 0) + 1 : Math.max(0, (prev.likesCount || 1) - 1)
      }));
    }
  };

  // 📝 SUBMIT COMMENT INSIDE INSPECTOR MODAL
  const handleAddCommentDetails = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment || !selectedPost) return;

    try {
      setSubmittingComment(true);
      const newComment = await addComment(selectedPost._id, commentText);
      setPostComments(prev => [...prev, newComment]);
      setCommentText("");

      // Sync and increment metrics counters back inside profile configuration stream array layout
      setProfile(prev => ({
        ...prev,
        posts: prev.posts.map(p => p._id === selectedPost._id ? {
          ...p,
          commentsCount: (p.commentsCount || 0) + 1
        } : p)
      }));
    } catch (err) {
      console.error("Failed adding comment onto focus layout view:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-12 bg-white p-8 rounded-2xl max-w-md mx-auto shadow-sm border">
        <p className="text-gray-500 font-medium">User profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen rounded-3xl shadow-sm border border-gray-100 overflow-hidden antialiased">

      {/* 🔥 HERO BANNER */}
      <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300 relative">
        {profile.banner ? (
          <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-tr from-slate-900 via-indigo-950 to-blue-900 opacity-90" />
        )}
      </div>

      {/* 🔥 USER METADATA BODY */}
      <div className="px-6 pb-6 relative">
        <div className="flex justify-between items-end -mt-16 mb-4">
          <img
            src={profile.avatar || "https://via.placeholder.com/150"}
            alt={profile.username}
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xs bg-white shrink-0"
          />

          {user?._id !== profile._id && (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all active:scale-95 cursor-pointer ${
                isFollowing
                  ? "bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-600 border border-gray-200/40"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{profile.username}</h2>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-xl whitespace-pre-wrap">
            {profile.bio || "No bio description provided yet."}
          </p>
        </div>

        {/* 🔥 COUNTER STRIPS */}
        <div className="flex gap-6 mt-5 pt-4 border-t border-gray-50 text-sm text-gray-500">
          <div><span className="font-extrabold text-gray-900">{profile.posts?.length || 0}</span> posts</div>
          <div onClick={() => handleOpenRelations("followers")} className="cursor-pointer hover:text-blue-600 transition-colors group">
            <span className="font-extrabold text-gray-900 group-hover:text-blue-600">{profile.followersCount || 0}</span> followers
          </div>
          <div onClick={() => handleOpenRelations("following")} className="cursor-pointer hover:text-blue-600 transition-colors group">
            <span className="font-extrabold text-gray-900 group-hover:text-blue-600">{profile.followingCount || 0}</span> following
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/50 flex items-center justify-center">
        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Publications</span>
      </div>

      {/* 🔥 GRID PREVIEW LAYOUT */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 min-h-96">
        {profile.posts?.length > 0 ? (
          profile.posts.map((post) => {
            const media = post.media?.[0];

            return (
              <div
                key={post._id}
                onClick={() => handleOpenPostDetails(post)}
                className="aspect-square bg-white overflow-hidden relative group cursor-pointer border border-gray-100"
              >
                {media?.type === "image" || (typeof media === 'string' && !media.match(/\.(mp4|webm|ogg)$/)) ? (
                  <img src={media.url || media} alt="Feed grid item" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : media?.type === "video" || (typeof media === 'string' && media.match(/\.(mp4|webm|ogg)$/)) ? (
                  <video src={media.url || media} className="w-full h-full object-cover" muted />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-500 font-medium p-4 line-clamp-4 bg-white text-center">
                    {post.content}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm font-bold">
                  <span>❤️ {post.likesCount || 0}</span>
                  <span>💬 {post.commentsCount || 0}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-medium">No publications posted yet.</p>
          </div>
        )}
      </div>

      {/* 👥 FOLLOWERS / FOLLOWING LIST POPUP MODAL */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[480px]">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-extrabold text-gray-900 capitalize text-md">
                {activeModal === "followers" ? "Followers" : "Following"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold bg-gray-200/60 p-1.5 rounded-full h-7 w-7 flex items-center justify-center cursor-pointer">✕</button>
            </div>
            <div className="p-2 overflow-y-auto flex-1 divide-y divide-gray-50">
              {loadingModalData ? (
                <div className="flex items-center justify-center py-12 gap-2 text-sm text-gray-400">
                  <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading connections...</span>
                </div>
              ) : modalDataList.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm italic">No users found in this list.</div>
              ) : (
                modalDataList.map((item) => {
                  const targetUser = item.user || item;
                  return (
                    <div key={targetUser._id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={targetUser.avatar || "https://via.placeholder.com/40"} alt="Avatar" className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-100" />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">@{targetUser.username}</span>
                          {targetUser.bio && <span className="text-xs text-gray-400 truncate max-w-[180px]">{targetUser.bio}</span>}
                        </div>
                      </div>
                      <button onClick={() => { setActiveModal(null); navigate(`/profile/${targetUser._id}`); }} className="text-xs font-bold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all cursor-pointer">View</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ 🔥 DYNAMIC CHOSEN POST INSPECTION GLASS OVERLAY MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 h-[90vh] md:h-[80vh]">
            
            {/* Left Side: Media Panel Window */}
            <div className="bg-black flex items-center justify-center relative overflow-hidden h-64 md:h-full border-b md:border-b-0 md:border-r border-gray-100">
              {selectedPost.media?.length > 0 ? (
                selectedPost.media[0].type === "video" || (typeof selectedPost.media[0] === 'string' && selectedPost.media[0].match(/\.(mp4|webm|ogg)$/)) ? (
                  <video src={selectedPost.media[0].url || selectedPost.media[0]} controls className="max-w-full max-h-full object-contain w-full h-full" />
                ) : (
                  <img src={selectedPost.media[0].url || selectedPost.media[0]} alt="Post Focus" className="max-w-full max-h-full object-contain" />
                )
              ) : (
                <div className="p-8 text-white font-medium text-center text-sm tracking-wide leading-relaxed px-12 max-h-full overflow-y-auto">
                  {selectedPost.content}
                </div>
              )}
            </div>

            {/* Right Side: Header + Interactions Track + Commentary Thread Panel */}
            <div className="flex flex-col h-full bg-white max-h-[calc(90vh-16rem)] md:max-h-full">
              
              {/* Profile Bar Segment */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <img src={profile.avatar || "https://via.placeholder.com/40"} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-extrabold text-gray-900 text-sm">@{profile.username}</span>
                </div>
                <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold bg-gray-200/40 p-1 rounded-full h-6 w-6 flex items-center justify-center cursor-pointer">✕</button>
              </div>

              {/* Scrollable Contents Block */}
              <div className="p-4 overflow-y-auto flex-1 space-y-4">
                {/* Optional description content display under side graphics wrapper panel */}
                {selectedPost.media?.length > 0 && (
                  <p className="text-sm text-gray-800 leading-relaxed pb-3 border-b border-gray-50 whitespace-pre-wrap">{selectedPost.content}</p>
                )}

                {/* Engagement Likes Counter Actions Panel */}
                <div className="flex items-center gap-4 py-1">
                  <button onClick={() => handleLikePostDetails(selectedPost._id)} className="flex items-center gap-1.5 group cursor-pointer">
                    <span className={`text-base p-1.5 rounded-full transition-colors ${selectedPost.isLiked ? 'bg-red-50 text-red-500' : 'group-hover:bg-gray-100 text-gray-400'}`}>
                      {selectedPost.isLiked ? "❤️" : "🤍"}
                    </span>
                    <span className={`text-xs font-bold ${selectedPost.isLiked ? 'text-red-500' : 'text-gray-500'}`}>{selectedPost.likesCount || 0} likes</span>
                  </button>
                  <div className="text-gray-400 text-xs font-bold flex items-center gap-1.5">
                    <span className="p-1.5 bg-blue-50 text-blue-500 rounded-full text-base">💬</span>
                    <span>{selectedPost.commentsCount || 0} comments</span>
                  </div>
                </div>

                {/* Commentary List Strip Window */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Discussion</h4>
                  {loadingComments ? (
                    <div className="flex items-center justify-center py-8 gap-2 text-xs text-gray-400">
                      <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Fetching discussion...</span>
                    </div>
                  ) : postComments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No commentary here yet. Be the first to start!</p>
                  ) : (
                    <div className="space-y-2.5">
                      {postComments.map((comment) => {
                        const commenter = comment.user || comment;
                        return (
                          <div key={comment._id} className="flex gap-2.5 bg-gray-50/60 p-2.5 rounded-xl border border-gray-100/50">
                            <img src={commenter.avatar || "https://via.placeholder.com/32"} alt="Commenter" className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-white" />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-bold text-gray-900 text-xs hover:underline cursor-pointer" onClick={() => { setSelectedPost(null); navigate(`/profile/${commenter._id}`); }}>
                                @{commenter.username || "anonymous"}
                              </span>
                              <p className="text-gray-700 text-xs mt-0.5 leading-relaxed break-words whitespace-pre-wrap">{comment.text || comment.content}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Input Footer Sticky Form Block */}
              <form onSubmit={handleAddCommentDetails} className="p-3 border-t border-gray-100 flex gap-2 shrink-0 bg-gray-50">
                <input 
                  type="text" 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)} 
                  placeholder="Add a comment thread..." 
                  className="w-full bg-white text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-800 transition-all shadow-xs"
                />
                <button 
                  type="submit" 
                  disabled={!commentText.trim() || submittingComment} 
                  className="bg-blue-500 text-white text-xs font-bold px-3.5 rounded-xl hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  {submittingComment ? "..." : "Send"}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserProfile;