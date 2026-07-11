const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    // 3. Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      username,
      email,
      password: hashPassword
    });

    // ✅ 5. Generate token (THIS WAS MISSING)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      status: 1,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "",
        bio: user.bio || "",
      },
    });

  } catch (error) {
    console.log("Register Error:", error);

    // ✅ Better error handling
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    res.status(500).json({
      message: error.message || "Server error"
    });
  }
};

module.exports = { registerUser };