const User = require("../models/User.model");
const Appointment = require("../models/Appointment.model");

// 📊 Admin stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

// 👥 Get all users (NO passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 📅 Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// 📄 System report
exports.getSystemReport = async (req, res) => {
  try {
    const report = {
      users: await User.countDocuments(),
      patients: await User.countDocuments({ role: "patient" }),
      doctors: await User.countDocuments({ role: "doctor" }),
      appointments: await Appointment.countDocuments(),
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
