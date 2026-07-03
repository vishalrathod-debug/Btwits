const Follow = require("../../models/follow.model");
const User = require("../../models/user.model");

const toggleFollowController = async (req, res) => {
  try {
    const userId = req.user.id; // current user
    const targetUserId = req.params.userId;

    if (userId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      follower: userId,
      following: targetUserId,
    });

    if (existingFollow) {
      // ❌ UNFOLLOW
      await Follow.deleteOne({ _id: existingFollow._id });

      return res.status(200).json({
        message: "Unfollowed",
        isFollowing: false,
      });
    }

    // ✅ FOLLOW
    await Follow.create({
      follower: userId,
      following: targetUserId,
    });

    return res.status(200).json({
      message: "Followed",
      isFollowing: true,
    });

  } catch (error) {
    console.log("Follow Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = toggleFollowController;