import { useEffect, useState } from "react";
import { addComment, getComments } from "../services/api";

function CommentSection({ postId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments when open
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getComments(postId)
      .then((data) => {
        if (!isMounted) return;
        // Matches your backend structure: res.status(200).json({ comments })
        const loadedComments = data?.comments || [];
        setComments(loadedComments);
      })
      .catch((err) => console.error("Error fetching comments:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  // Handle comment submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    try {
      setSubmitting(true);
      const data = await addComment(postId, text);
      
      // Matches your backend structure: res.status(201).json({ message, comment })
      if (data && data.comment) {
        let newComment = data.comment;

        // 🛡️ ANTI-ANONYMOUS GUARD
        // If the backend user field is a raw ID string or missing properties, hydrate locally
        if (!newComment.user || typeof newComment.user === "string" || !newComment.user.username) {
          const localUserStr = localStorage.getItem("user");
          const loggedInUser = localUserStr ? JSON.parse(localUserStr) : null;

          newComment = {
            ...newComment,
            user: {
              _id: typeof newComment.user === "string" ? newComment.user : (loggedInUser?._id || "me"),
              username: loggedInUser?.username || "you",
              avatar: loggedInUser?.avatar || ""
            }
          };
        }

        // Prepend to top since getComments sorts by { createdAt: -1 }
        setComments((prev) => [newComment, ...prev]);
        setText("");
        
        if (onCommentAdded) onCommentAdded();
      } else {
        console.error("Unexpected backend payload structure:", data);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Comments</h4>

      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition disabled:bg-gray-300 cursor-pointer"
        >
          {submitting ? "..." : "Post"}
        </button>
      </form>

      {/* Comments List View Window */}
      {loading ? (
        <p className="text-xs text-gray-400 animate-pulse">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 italic">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {comments.map((comment, index) => {
            const commentId = comment._id || `fallback-key-${index}`;
            const username = comment.user?.username || "anonymous";
            
            return (
              <div key={commentId} className="bg-gray-50 p-2.5 rounded-xl text-sm flex gap-2.5 items-start">
                
                {/* Clean CSS Initials Placeholder if Avatar Missing */}
                {comment.user?.avatar ? (
                  <img 
                    src={comment.user.avatar} 
                    alt={username} 
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                    {username.substring(0, 2)}
                  </div>
                )}

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-800 text-xs">
                      @{username}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs break-words">{comment.text}</p>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CommentSection;