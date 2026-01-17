const Prescription = require("../models/Prescription.model");

// Doctor creates prescription
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, medicines, instructions } = req.body;

    if (!appointmentId || !patientId || !medicines) {
      return res.status(400).json({
        message: "Required fields are missing"
      });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: req.user.id,
      patient: patientId,
      medicines,
      instructions
    });

    res.status(201).json({
      message: "Prescription created successfully",
      prescription
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Patient views prescriptions
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patient: req.user.id
    })
      .populate("doctor", "name email")
      .populate("appointment", "appointmentDate");

    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
