const User = require("../../models/user.model");

const getMeController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("_id username email avatar bio"); // ✅ only required fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Return consistent shape
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
      bio: user.bio || "",
    });

  } catch (error) {
    console.log("GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getMeController;