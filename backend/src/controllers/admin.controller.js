const User = require("../models/User.model");
const Appointment = require("../models/Appointment.model");
const AuditLog = require("../models/AuditLog.model");
const log = require("../utils/auditLogger");

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

// 👥 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch {
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
  } catch {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// 📄 System report
exports.getSystemReport = async (req, res) => {
  try {
    res.json({
      users: await User.countDocuments(),
      patients: await User.countDocuments({ role: "patient" }),
      doctors: await User.countDocuments({ role: "doctor" }),
      appointments: await Appointment.countDocuments(),
    });
  } catch {
    res.status(500).json({ message: "Failed to generate report" });
  }
};

// 🔁 Toggle user active status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    await log({
      req,
      action: "TOGGLE_USER_STATUS",
      targetType: "User",
      targetId: user._id,
      metadata: { newStatus: user.isActive },
    });

    res.json({ message: "User status updated", isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    await log({
      req,
      action: "DELETE_USER",
      targetType: "User",
      targetId: req.params.id,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🧾 Fetch audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
