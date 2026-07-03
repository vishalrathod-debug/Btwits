const Comment = require("../../models/comment.model");
const Post = require("../../models/post.model");

const deleteCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: commentId });

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    res.status(200).json({
      message: "Comment deleted",
    });

  } catch (error) {
    console.log("Delete Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteCommentController;