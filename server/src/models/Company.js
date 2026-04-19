const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, "Please enter a valid URL"]
    },
    notes: {
      type: String,
      trim: true
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

module.exports = mongoose.model("Company", companySchema);