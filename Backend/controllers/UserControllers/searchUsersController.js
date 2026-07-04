const User = require("../../models/user.model");

const searchUsersController = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } }
      ]
    })
      .select("username avatar bio")
      .limit(10);

    res.status(200).json({ users });

  } catch (error) {
    console.log("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = searchUsersController;