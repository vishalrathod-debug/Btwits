const Like = require("../../models/like.model");
const Post = require("../../models/post.model");

const toggleLikeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    if (existingLike) {
      // 💔 UNLIKE
      await Like.deleteOne({ _id: existingLike._id });

      await Post.findByIdAndUpdate(postId, {
        $inc: { likesCount: -1 },
      });

      return res.status(200).json({
        message: "Post unliked",
        isLiked: false,
      });
    }

    // ❤️ LIKE
    await Like.create({
      user: userId,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { likesCount: 1 },
    });

    return res.status(200).json({
      message: "Post liked",
      isLiked: true,
    });

  } catch (error) {
    console.log("Like Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = toggleLikeController;