const Post = require("../../models/post.model");
const Like = require("../../models/like.model");

const getPostsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username avatar");

    const totalPosts = await Post.countDocuments({ isDeleted: false });

    // 🔥 OPTIMIZED LIKE QUERY
    const postIds = posts.map((p) => p._id);

    const likes = await Like.find({
      user: req.user.id,
      post: { $in: postIds },
    });

    const likedPostIds = likes.map((l) => l.post.toString());

    // 🔥 attach isLiked
    const postsWithLike = posts.map((post) => ({
      ...post._doc,
      isLiked: likedPostIds.includes(post._id.toString()),
    }));

    res.status(200).json({
      posts: postsWithLike,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: page * limit < totalPosts,
    });

  } catch (error) {
    console.log("Get Posts Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = getPostsController;