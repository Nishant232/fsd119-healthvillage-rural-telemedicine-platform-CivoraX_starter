const mongoose = require("mongoose");

const teleconsultationSchema = new mongoose.Schema(
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

    meetingLink: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled"
    },

    //  Chat messages
    messages: [
      {
        senderRole: {
          type: String,
          enum: ["doctor", "patient"],
          required: true
        },
        message: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // File sharing during consultation
    files: [
      {
        filename: {
          type: String,
          required: true
        },
        uploadedBy: {
          type: String,
          enum: ["doctor", "patient"],
          required: true
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Audit log (for compliance & tracking)
    audit: [
      {
        action: {
          type: String,
          required: true
        },
        role: {
          type: String,
          enum: ["doctor", "patient"],
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Teleconsultation", teleconsultationSchema);
