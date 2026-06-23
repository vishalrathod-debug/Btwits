const User = require("../models/user.model");

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

        // 3. Create user
        const user = await User.create({
            username,
            email,
            password   // ⚠️ plain for now (you'll hash later)
        });

        // 4. Send response (DON'T send password)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Register Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { registerUser };