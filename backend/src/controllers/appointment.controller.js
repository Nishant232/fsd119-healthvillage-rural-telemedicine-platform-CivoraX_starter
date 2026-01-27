const Appointment = require("../models/Appointment.model");
const Availability = require("../models/Availability.model");

/**
 * Patient books appointment
 */
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, reason } = req.body;

    if (!doctorId || !appointmentDate || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const appointmentTime = new Date(appointmentDate);

    // Step 2.1.4 — Check doctor availability (day + time)
    const day = appointmentTime.toLocaleDateString("en-US", {
      weekday: "short"
    });

    const availability = await Availability.findOne({
      doctor: doctorId,
      day
    });

    if (!availability) {
      return res.status(400).json({
        message: "Doctor not available on selected day"
      });
    }

    const appointmentHour = appointmentTime.getHours();
    const startHour = parseInt(availability.startTime.split(":")[0]);
    const endHour = parseInt(availability.endTime.split(":")[0]);

    if (appointmentHour < startHour || appointmentHour >= endHour) {
      return res.status(400).json({
        message: "Appointment time is outside doctor's available hours"
      });
    }

    //  Step 2.1.4 — Prevent overlapping appointments
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked"
      });
    }

    //  Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
      reason,
      status: "pending"
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Doctor views their appointments
 */
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

/**
 * Doctor updates appointment status
 */
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
