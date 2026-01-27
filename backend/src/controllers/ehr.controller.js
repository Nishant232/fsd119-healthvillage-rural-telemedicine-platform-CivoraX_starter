const EHR = require("../models/EHR.model");
const { encrypt, decrypt } = require("../utils/encryption");

// Doctor creates EHR
exports.createEHR = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      symptoms,
      diagnosis,
      treatmentPlan,
      notes
    } = req.body;

    if (!appointmentId || !patientId || !symptoms || !diagnosis || !treatmentPlan) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // 🔐 Encrypt sensitive medical data before saving
    const ehr = await EHR.create({
      appointment: appointmentId,
      doctor: req.user.id,
      patient: patientId,
      symptoms: encrypt(symptoms),
      diagnosis: encrypt(diagnosis),
      treatmentPlan: encrypt(treatmentPlan),
      notes: encrypt(notes)
    });

    res.status(201).json({
      message: "EHR created successfully"
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

    // 🔓 Decrypt data before sending to patient
    const decryptedEHRs = ehrs.map((ehr) => ({
      ...ehr.toObject(),
      symptoms: decrypt(ehr.symptoms),
      diagnosis: decrypt(ehr.diagnosis),
      treatmentPlan: decrypt(ehr.treatmentPlan),
      notes: decrypt(ehr.notes)
    }));

    res.json({ ehrs: decryptedEHRs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
