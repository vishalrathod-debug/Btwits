const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        trim: true,
        maxlength: 300
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    media: [
        {
            url: String,
            type: {
                type: String,
                enum: ["image", "video"]
            }
        }
    ],

    likesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);
postSchema.index({ user: 1 });
postSchema.index({ createdAt: -1 });
const Post = mongoose.model("Post", postSchema);
module.exports = Post
