import { useEffect, useState } from "react";
import { addComment, getComments } from "../services/api";


// 🧱 ISOLATED COMMENT SECTION SUB-COMPONENT
function CommentSection({ postId, onCommentAdded, navigate }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingComments(true);
    
    getComments(postId)
      .then((data) => {
        if (!isMounted) return;
        setComments(data.comments || data || []);
      })
      .catch((err) => console.error("Error fetching comments:", err))
      .finally(() => {
        if (isMounted) setLoadingComments(false);
      });

    return () => { isMounted = false; };
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    try {
      setSubmitting(true);
      const newComment = await addComment(postId, text);
      
      setComments((prev) => [...prev, newComment]);
      setText("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error("Post comment failure:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
      {/* Input Form */}
      <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a public comment..."
          className="w-full bg-gray-50 text-sm border border-gray-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="bg-blue-500 text-white text-sm font-bold h-9 px-4 rounded-xl hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {submitting ? "..." : "Post"}
        </button>
      </form>

      {/* Comments List Window */}
      {loadingComments ? (
        <div className="flex items-center gap-2 py-1 justify-center">
          <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-400">Loading threads...</p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400 italic text-center py-1 bg-gray-50/50 rounded-lg">
          No commentary here yet. Start the conversation!
        </p>
      ) : (
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-2.5 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100/50">
              <img 
                src={comment.user?.avatar || "https://via.placeholder.com/32"} 
                alt="Commenter avatar" 
                onClick={() => navigate(`/profile/${comment.user?._id}`)}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white shrink-0 mt-0.5 cursor-pointer hover:opacity-90"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span 
                    onClick={() => navigate(`/profile/${comment.user?._id}`)}
                    className="font-bold text-gray-900 text-xs hover:underline cursor-pointer"
                  >
                    @{comment.user?.username || "anonymous"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {comment.createdAt && new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-gray-700 text-xs mt-0.5 leading-relaxed wrap-break-word whitespace-pre-wrap">
                  {comment.text || comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default CommentSection;