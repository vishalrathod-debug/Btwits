const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { loginUser } = require("../controllers/loginController");
const { getDataByIdController } = require("../controllers/getDataByIdController");

console.log("User routes loaded");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login",loginUser)

// GET /api/users/id
router.get("/:id",getDataByIdController)



module.exports = router;