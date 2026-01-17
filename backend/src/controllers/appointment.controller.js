const Appointment = require("../models/Appointment.model");

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason } = req.body;

    if (!doctorId || !appointmentDate || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,      // logged-in patient
      doctor: doctorId,
      appointmentDate,
      reason
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Doctor: view their appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id
    })
      .populate("patient", "name email")
      .sort({ appointmentDate: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Doctor: update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Appointment status updated",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
