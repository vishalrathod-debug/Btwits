const Post = require("../../models/post.model");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createPostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    let media = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        let result;

        try {
          // 🔥 FIX: use upload_large for videos
          result = await cloudinary.uploader.upload_large(file.path, {
            resource_type: "auto",
          });
        } catch (err) {
          console.log("Cloudinary upload error:", err);
          continue; // skip failed file instead of crashing
        }

        const type = file.mimetype.startsWith("image")
          ? "image"
          : file.mimetype.startsWith("video")
          ? "video"
          : "other";

        media.push({
          url: result.secure_url,
          type,
        });

        // 🔥 safe delete
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    const newPost = await Post.create({
      user: userId,
      title,
      content,
      media,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });

  } catch (error) {
    console.log("Create Post Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message, // 🔥 helps debugging
    });
  }
};

module.exports = createPostController;