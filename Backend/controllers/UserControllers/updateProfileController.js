const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const User = require("../../models/user.model");

const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;

    let avatarUrl = null;
    let bannerUrl = null;

    // ✅ Avatar upload
    if (req.files?.avatar) {
      const file = req.files.avatar[0];

      const result = await cloudinary.uploader.upload(file.path);
      avatarUrl = result.secure_url;

      fs.unlinkSync(file.path); // delete temp file
    }

    // ✅ Banner upload
    if (req.files?.banner) {
      const file = req.files.banner[0];

      const result = await cloudinary.uploader.upload(file.path);
      bannerUrl = result.secure_url;

      fs.unlinkSync(file.path);
    }

    // ✅ Update DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: req.body.username,
        bio: req.body.bio,
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(bannerUrl && { banner: bannerUrl }),
      },
      { new: true }
    );

    res.json(updatedUser);

  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfileController };