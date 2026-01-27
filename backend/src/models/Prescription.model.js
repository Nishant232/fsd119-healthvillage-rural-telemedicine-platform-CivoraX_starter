const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
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

    medicines: [
      {
        name: {
          type: String,
          required: true
        },
        dosage: {
          type: String,
          required: true
        },
        frequency: {
          type: String,
          required: true
        },
        duration: {
          type: String,
          required: true
        }
      }
    ],

    instructions: {
      type: String
    },

    // Priority-2.2 fields
    status: {
      type: String,
      enum: ["issued", "viewed", "fulfilled"],
      default: "issued"
    },

    followUpDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
