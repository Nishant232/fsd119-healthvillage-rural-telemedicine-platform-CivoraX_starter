const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// Any logged-in user
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user
  });
});

// Only doctors
router.get(
  "/doctor-area",
  authMiddleware,
  roleMiddleware("doctor"),
  (req, res) => {
    res.json({ message: "Welcome Doctor 👨‍⚕️" });
  }
);

// Only admins
router.get(
  "/admin-area",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👨‍💼" });
  }
);

module.exports = router;
