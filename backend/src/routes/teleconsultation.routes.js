const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const teleconsultationController = require("../controllers/teleconsultation.controller");

/**
 * Doctor starts teleconsultation
 */
router.post(
  "/start",
  authMiddleware,
  roleMiddleware("doctor"),
  teleconsultationController.startConsultation
);

/**
 * Doctor or Patient views teleconsultation details
 */
router.get(
  "/:appointmentId",
  authMiddleware,
  teleconsultationController.getConsultation
);

/**
 * Doctor or Patient sends chat message
 */
router.post(
  "/:appointmentId/message",
  authMiddleware,
  teleconsultationController.sendMessage
);

/**
 * Upload file during consultation (Doctor / Patient)
 */
router.post(
  "/:appointmentId/upload",
  authMiddleware,
  upload.single("file"),
  teleconsultationController.uploadFile
);

/**
 * Doctor ends teleconsultation
 */
router.patch(
  "/:appointmentId/end",
  authMiddleware,
  roleMiddleware("doctor"),
  teleconsultationController.endConsultation
);

module.exports = router;
