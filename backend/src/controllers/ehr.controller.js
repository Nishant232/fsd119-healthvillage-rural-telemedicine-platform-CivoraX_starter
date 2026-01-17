const EHR = require("../models/EHR.model");

// Doctor creates EHR
exports.createEHR = async (req, res) => {
  try {
    const { appointmentId, symptoms, diagnosis, treatmentPlan, notes } = req.body;

    if (!appointmentId || !symptoms || !diagnosis || !treatmentPlan) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    const ehr = await EHR.create({
      appointment: appointmentId,
      doctor: req.user.id,
      patient: req.body.patientId,
      symptoms,
      diagnosis,
      treatmentPlan,
      notes
    });

    res.status(201).json({
      message: "EHR created successfully",
      ehr
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Patient views their EHRs
exports.getPatientEHRs = async (req, res) => {
  try {
    const ehrs = await EHR.find({
      patient: req.user.id
    })
      .populate("doctor", "name email")
      .populate("appointment", "appointmentDate");

    res.json({ ehrs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
