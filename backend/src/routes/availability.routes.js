const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/availability.controller");

router.post("/", auth, role("doctor"), controller.setAvailability);

module.exports = router;
