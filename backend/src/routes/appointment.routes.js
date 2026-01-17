const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const appointmentController = require("../controllers/appointment.controller");

// Patient books appointment
router.post(
  "/",
  authMiddleware,
  roleMiddleware("patient"),
  appointmentController.createAppointment
);

// Doctor: view appointments
router.get(
  "/doctor",
  authMiddleware,
  roleMiddleware("doctor"),
  appointmentController.getDoctorAppointments
);

// Doctor: update appointment status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("doctor"),
  appointmentController.updateAppointmentStatus
);

module.exports = router;
