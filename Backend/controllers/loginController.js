const User = require("../models/user.model");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (! email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No user found"
            });
        }

        // 3. Check password
        if (user.password !== password) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        // 4. Success
        return res.status(200).json({
            message: "Login successful",
            status: 1,
            id: user._id
        });

    } catch (error) {
        console.log("Login Error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {loginUser};