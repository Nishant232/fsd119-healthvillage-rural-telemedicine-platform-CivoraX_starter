const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

// 🔐 All routes below require ADMIN

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllUsers
);

router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAllAppointments
);

router.get(
  "/report",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getSystemReport
);

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getStats
);

module.exports = router;
