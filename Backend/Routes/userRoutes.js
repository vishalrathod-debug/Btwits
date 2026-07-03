const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/UserControllers/userController");
const { loginUser } = require("../controllers/UserControllers/loginController");
const { getDataByIdController } = require("../controllers/UserControllers/getDataByIdController");
const { authMiddleware } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const { updateProfileController } = require("../controllers/UserControllers/updateProfileController");
const getMeController = require("../controllers/UserControllers/getMeController");

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
// GET /api/users/me
router.get("/me", authMiddleware, getMeController);

// GET /api/users/:id
router.get("/:id", getDataByIdController);




module.exports = router;