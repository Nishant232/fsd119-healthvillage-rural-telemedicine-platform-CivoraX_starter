const appointmentRoutes = require("./routes/appointment.routes");
const ehrRoutes = require("./routes/ehr.routes");
const prescriptionRoutes = require("./routes/prescription.routes");
const adminRoutes = require("./routes/admin.routes");
const teleconsultationRoutes = require("./routes/teleconsultation.routes");


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// User routes
app.use("/api/users", userRoutes);

// user appointments
app.use("/api/appointments", appointmentRoutes);

// EHR (Electronic Health Record)
app.use("/api/ehr", ehrRoutes);

// prescriptions
app.use("/api/prescriptions", prescriptionRoutes);

// adminRoutes
app.use("/api/admin", adminRoutes);

// Availability
app.use("/api/availability", require("./routes/availability.routes"));

//  Teliconsuntant
app.use("/api/teleconsultation", teleconsultationRoutes);

// Admin Routes
app.use("/api/admin", require("./routes/admin.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HealthVillage API is running 🚑" });
});

module.exports = app;
