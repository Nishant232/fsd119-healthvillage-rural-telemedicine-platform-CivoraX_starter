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
      patient: patientId,
      doctor: req.user.id,
      medicines: encrypt(medicines),
      instructions: encrypt(instructions),
      followUpDate
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

    prescription.medicines = decrypt(prescription.medicines);
    prescription.instructions = decrypt(prescription.instructions);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Prescription as Viewed
exports.markViewed = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  prescription.status = "viewed";
  await prescription.save();

  res.json({ message: "Prescription viewed" });
};

