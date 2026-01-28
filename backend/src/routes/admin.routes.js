const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

// 🔐 ADMIN ONLY ROUTES

router.get("/users", authMiddleware, roleMiddleware("admin"), adminController.getAllUsers);
router.get("/appointments", authMiddleware, roleMiddleware("admin"), adminController.getAllAppointments);
router.get("/report", authMiddleware, roleMiddleware("admin"), adminController.getSystemReport);
router.get("/stats", authMiddleware, roleMiddleware("admin"), adminController.getStats);

// 🧾 Audit logs
router.get(
  "/audit-logs",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.getAuditLogs
);

// 🔁 User actions
router.patch(
  "/users/:id/toggle",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.toggleUserStatus
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.deleteUser
);

module.exports = router;
