const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    round: {
      type: String,
      required: [true, "Interview round is required"],
      trim: true
    },
    interviewDate: {
      type: Date,
      required: [true, "Interview date is required"]
    },
    mode: {
      type: String,
      enum: ["Online", "Phone", "In-person"],
      required: true
    },
    outcome: {
      type: String,
      enum: ["Pending", "Passed", "Failed"],
      default: "Pending"
    },
    notes: {
      type: String,
      trim: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Interview", interviewSchema);