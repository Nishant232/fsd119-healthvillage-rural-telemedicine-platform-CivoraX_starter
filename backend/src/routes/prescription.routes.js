const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const prescriptionController = require("../controllers/prescription.controller");

// Doctor creates prescription
router.post(
  "/",
  authMiddleware,
  roleMiddleware("doctor"),
  prescriptionController.createPrescription
);

// Patient views prescriptions
router.get(
  "/patient",
  authMiddleware,
  roleMiddleware("patient"),
  prescriptionController.getPatientPrescriptions
);

module.exports = router;
