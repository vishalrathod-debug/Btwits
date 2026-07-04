const Follow = require("../../models/follow.model");
const User = require("../../models/user.model");

const getFollowersController = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "username avatar bio")
      .lean();

    res.status(200).json({
      users: followers.map(f => f.follower),
    });

  } catch (err) {
    console.log("Followers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getFollowersController;