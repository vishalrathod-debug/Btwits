const Follow = require("../../models/follow.model");

const getFollowingController = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ follower: userId })
      .populate("following", "username avatar bio")
      .lean();

    res.status(200).json({
      users: following.map(f => f.following),
    });

  } catch (err) {
    console.log("Following error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getFollowingController;