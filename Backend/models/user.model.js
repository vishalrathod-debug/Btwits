const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: "",
        trim: true,
        maxlength: 160
    },
    avatar: {
        type: String,
        default: ""
    },
    banner: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;