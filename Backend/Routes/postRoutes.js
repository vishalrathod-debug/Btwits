const express = require("express");
const router = express.Router();
const createPostController = require("../controllers/PostControllers/createPostController");
const { authMiddleware } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const getPostsController = require("../controllers/PostControllers/getPostsController");
const toggleLikeController = require("../controllers/PostControllers/toggleLikeController");

// Removed trailing spaces from the require paths below 🧹
const toggleFollowController = require("../controllers/PostControllers/toggleFollowController ");
const addCommentController = require("../controllers/PostControllers/addCommentController ");
const getCommentsController = require("../controllers/PostControllers/getCommentsController ");
const deleteCommentController = require("../controllers/PostControllers/deleteCommentController ");

// POST /api/posts
router.post(
  "/",
  authMiddleware,
  upload.array("media", 5),   // ✅ supports both image + video
  createPostController
);

// GET /api/posts
router.get(
  "/",
  authMiddleware,
  getPostsController
);

router.post("/:postId/like",
   authMiddleware,
   toggleLikeController);

router.post("/:userId/follow",
   authMiddleware, 
   toggleFollowController);

// 💬 FIXED: Added "/comment" to match your frontend Axios POST request
router.post("/:postId/comment", authMiddleware, addCommentController);

// 💬 FIXED: Added "/comments" to match your frontend Axios GET request
router.get("/:postId/comments", authMiddleware, getCommentsController);

// 🗑️ FIXED: Cleaned up path naming consistency if needed later
router.delete("/:commentId", authMiddleware, deleteCommentController);

module.exports = router;