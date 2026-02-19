const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide task name"],
      maxlength: 50,
    },
    task: {
      type: String,
      required: [true, "Provide details or subtasks"],
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["pending", "delayed", "completed"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Task', TaskSchema)