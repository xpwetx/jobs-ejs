// models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "Company name is required"],
  },
  position: {
    type: String,
    required: [true, "Position is required"],
  },
  status: {
    type: String,
    default: "pending",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);