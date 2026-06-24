const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { loginUser } = require("../controllers/loginController");
const { getDataByIdController } = require("../controllers/getDataByIdController");
const User = require("../models/user.model");
const { authMiddleware } = require("../middleware/auth.middleware");

console.log("User routes loaded");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// ✅ VERY IMPORTANT: place /me BEFORE /:id
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/users/:id
router.get("/:id", getDataByIdController);

module.exports = router;