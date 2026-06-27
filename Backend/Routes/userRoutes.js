const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { loginUser } = require("../controllers/loginController");
const { getDataByIdController } = require("../controllers/getDataByIdController");
const User = require("../models/user.model");
const { authMiddleware } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const { updateProfileController } = require("../controllers/updateProfileController");

console.log("User routes loaded");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

//PUT /api/users/update
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateProfileController
);


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