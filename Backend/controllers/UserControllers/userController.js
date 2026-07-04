const User = require("../../models/user.model");
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // 1. Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashPassword = await bcrypt.hash(password, 10)
        // 3. Create user
        const user = await User.create({
            username,
            email,
            password: hashPassword
        });

        // 4. Send response (DON'T send password)
        res.status(201).json({
            message: "User registered successfully",
            status: 1,
            token, // 🔥 ADD THIS (important)
            user: {
                _id: user._id,         // ✅ FIX (use _id not id)
                username: user.username,
                email: user.email,
                avatar: user.avatar || "",
                bio: user.bio || "",
            },
        });

    } catch (error) {
        console.log("Register Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { registerUser };