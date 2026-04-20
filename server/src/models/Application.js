const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    roleTitle: {
      type: String,
      required: [true, "Role title is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Interview Scheduled", "Rejected", "Offered", "Accepted"],
      default: "Applied"
    },
    applicationDate: {
      type: Date,
      required: [true, "Application date is required"]
    },
    salaryExpectation: {
    type: Number,
    min: [0, "Salary cannot be negative"]
  },
    notes: {
      type: String,
      trim: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Application", applicationSchema);