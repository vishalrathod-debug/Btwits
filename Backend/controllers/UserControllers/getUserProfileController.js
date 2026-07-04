const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Follow = require("../../models/follow.model");
const Post = require("../../models/post.model");

const getUserProfileController = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // ✅ get user
        const user = await User.findById(userId).select("-password").lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ get posts
        const posts = await Post.find({
            user: new mongoose.Types.ObjectId(userId),
        })
            .sort({ createdAt: -1 })
            .lean();

        console.log("POST COUNT:", posts.length);

        // ✅ follow check
        let isFollowing = false;

        if (currentUserId) {
            const follow = await Follow.findOne({
                follower: currentUserId,
                following: userId,
            });

            isFollowing = !!follow;
        }

        const followersCount = await Follow.countDocuments({
            following: userId,
        });

        const followingCount = await Follow.countDocuments({
            follower: userId,
        });

        res.status(200).json({
            user: {
                ...user,
                posts,
                followersCount,
                followingCount,
            },
            isFollowing,
        });
    } catch (error) {
        console.log("Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = getUserProfileController;