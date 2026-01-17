const mongoose = require("mongoose");

const ehrSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    symptoms: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    treatmentPlan: {
      type: String,
      required: true
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("EHR", ehrSchema);
