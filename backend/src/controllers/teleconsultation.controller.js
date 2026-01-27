const Teleconsultation = require("../models/Teleconsultation.model");
const Appointment = require("../models/Appointment.model");

// Doctor starts teleconsultation
exports.startConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const meetingLink = `https://meet.jit.si/consult-${appointmentId}`;

    const consultation = await Teleconsultation.create({
        appointment: appointmentId,
        doctor: appointment.doctor,
        patient: appointment.patient,
        meetingLink,
        status: "scheduled",
        audit: [
      {
        action: "consultation_started",
        role: "doctor"
      }
  ]
});


    res.status(201).json({
      message: "Teleconsultation started",
      consultation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Doctor or Patient views consultation
exports.getConsultation = async (req, res) => {
  try {
    const consultation = await Teleconsultation.findOne({
      appointment: req.params.appointmentId
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    res.json({ consultation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send chat message
exports.sendMessage = async (req, res) => {
  try {
    const consultation = await Teleconsultation.findOne({
      appointment: req.params.appointmentId
    });

    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }

    // A2 VALIDATION
    if (consultation.status === "completed") {
      return res.status(400).json({
        message: "Consultation already ended"
      });
    }

    consultation.messages.push({
      senderRole: req.user.role,
      message: req.body.message
    });

    consultation.audit.push({
      action: "message_sent",
      role: req.user.role
    });

    await consultation.save();

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// End consultation
exports.endConsultation = async (req, res) => {
  try {
    const consultation = await Teleconsultation.findOne({
      appointment: req.params.appointmentId
    });

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found"
      });
    }

  
    if (consultation.status === "completed") {
      return res.status(400).json({
        message: "Consultation already ended"
      });
    }

    consultation.status = "completed";

    consultation.audit.push({
      action: "consultation_ended",
      role: req.user.role
    });

    await consultation.save();

    res.json({ message: "Consultation ended successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- upload files---
exports.uploadFile = async (req, res) => {
  try {
    const consultation = await Teleconsultation.findOne({
      appointment: req.params.appointmentId
    });

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found"
      });
    }

    
    if (consultation.status === "completed") {
      return res.status(400).json({
        message: "Consultation already ended"
      });
    }

    consultation.files.push({
      filename: req.file.filename,
      uploadedBy: req.user.role
    });

    consultation.audit.push({
      action: "file_uploaded",
      role: req.user.role
    });

    await consultation.save();

    res.json({
      message: "File uploaded successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

