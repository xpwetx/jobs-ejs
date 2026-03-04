const Job = require("../models/Job");

// List all jobs for the logged-in user
exports.listJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });
  res.render("jobs", { jobs });
};

// Show form for new job
exports.newJobForm = (req, res) => {
  res.render("job", { job: null });
};

// Show form to edit existing job
exports.editJobForm = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!job) return res.redirect("/jobs");
  res.render("job", { job });
};

// Create job
exports.createJob = async (req, res) => {
  const { company, position, status } = req.body;
  await Job.create({ company, position, status, createdBy: req.user._id });
  res.redirect("/jobs");
};

// Update job
exports.updateJob = async (req, res) => {
  const { company, position, status } = req.body;
  await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { company, position, status }
  );
  res.redirect("/jobs");
};

// Delete job
exports.deleteJob = async (req, res) => {
  await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  res.redirect("/jobs");
};