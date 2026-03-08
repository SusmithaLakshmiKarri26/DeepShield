const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected API
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    userId: req.user.userId
  });
});

module.exports = router;
