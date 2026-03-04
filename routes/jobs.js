const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const jobsController = require("../controllers/jobs");

router.use(auth);

// List all jobs
router.get("/", jobsController.listJobs);

// Show form for new job
router.get("/new", jobsController.newJobForm);

// Show form for editing a job
router.get("/edit/:id", jobsController.editJobForm);

// Add new job
router.post("/", jobsController.createJob);

// Update a job
router.post("/update/:id", jobsController.updateJob);

// Delete a job
router.post("/delete/:id", jobsController.deleteJob);

module.exports = router;