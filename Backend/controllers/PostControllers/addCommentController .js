const Comment = require("../../models/comment.model");
const Post = require("../../models/post.model");

const addCommentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      user: userId,
      post: postId,
      text,
    });

    // ✅ increment comment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    // populate user for frontend
    const populatedComment = await comment.populate("user", "username avatar");

    res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });

  } catch (error) {
    console.log("Add Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = addCommentController;