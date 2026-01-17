const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const ehrController = require("../controllers/ehr.controller");

// Doctor creates EHR
router.post(
  "/",
  authMiddleware,
  roleMiddleware("doctor"),
  ehrController.createEHR
);

// Patient views their EHRs
router.get(
  "/patient",
  authMiddleware,
  roleMiddleware("patient"),
  ehrController.getPatientEHRs
);

module.exports = router;
