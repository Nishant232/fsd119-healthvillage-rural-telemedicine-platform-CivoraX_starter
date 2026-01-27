exports.checkFollowUps = async () => {
  const today = new Date().toISOString().split("T")[0];

  const prescriptions = await Prescription.find({
    followUpDate: today
  });

  prescriptions.forEach(p => {
    console.log("Follow-up reminder for patient:", p.patient);
  });
};
