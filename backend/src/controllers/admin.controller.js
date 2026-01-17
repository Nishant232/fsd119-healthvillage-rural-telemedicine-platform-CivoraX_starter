const User = require("../models/User.model");
const Appointment = require("../models/Appointment.model");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Basic system report
exports.getSystemReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
