const Comment = require("../../models/comment.model");

const getCommentsController = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");

    res.status(200).json({
      comments,
    });

  } catch (error) {
    console.log("Get Comments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getCommentsController;