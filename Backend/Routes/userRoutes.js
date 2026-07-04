const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/UserControllers/userController");
const { loginUser } = require("../controllers/UserControllers/loginController");
const { authMiddleware } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const { updateProfileController } = require("../controllers/UserControllers/updateProfileController");
const getMeController = require("../controllers/UserControllers/getMeController");
const getUserProfileController = require("../controllers/UserControllers/getUserProfileController");


const getFollowersController = require("../controllers/UserControllers/getFollowersController");
const getFollowingController = require("../controllers/UserControllers/getFollowingController");
const searchUsersController = require("../controllers/UserControllers/searchUsersController");


console.log("User routes loaded");

// 🔐 AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔄 UPDATE PROFILE
router.put(
  "/update",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateProfileController
);

// 👤 CURRENT USER
router.get("/me", authMiddleware, getMeController);

// 🔥 USER PROFILE (VERY IMPORTANT: KEEP BEFORE ANY :id ROUTE)
router.get("/profile/:id", authMiddleware, getUserProfileController);

// ADD THESE
router.get("/:id/followers", getFollowersController);
router.get("/:id/following", getFollowingController);

router.get("/search", authMiddleware, searchUsersController);

module.exports = router;