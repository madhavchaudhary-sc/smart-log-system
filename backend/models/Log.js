const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      required: true,
      enum: ["INFO", "WARNING", "ERROR", "CRITICAL"],
    },

    status: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isAnomaly: {
      type: Boolean,
      default: false,
    },

    anomalyScore: {
      type: Number,
      default: 0,
    },

    anomalyReason: {
      type: String,
      default: "",
    },

    aiExplanation: {
      type: String,
      default: "",
    },

    rootCause: {
      type: String,
      default: "",
    },

    nextStep: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", logSchema);