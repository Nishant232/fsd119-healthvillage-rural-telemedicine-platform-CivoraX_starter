const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/prescription.controller");

// Doctor creates prescription
router.post(
  "/",
  auth,
  role("doctor"),
  controller.createPrescription
);

// Patient views their prescriptions
router.get(
  "/patient",
  auth,
  role("patient"),
  controller.getPatientPrescriptions
);

//  Priority-2.2: Patient marks prescription as viewed
router.patch(
  "/:id/view",
  auth,
  role("patient"),
  controller.markViewed
);

module.exports = router;
