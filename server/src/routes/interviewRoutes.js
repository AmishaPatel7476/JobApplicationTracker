const express = require("express");
const router = express.Router();

const {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview
} = require("../controllers/interviewController");

const { protect } = require("../middleware/authMiddleware");
const { validateInterview } = require("../middleware/validationMiddleware");
const { checkOwnership } = require("../middleware/ownershipMiddleware");

const Interview = require("../models/Interview");

router.route("/")
  .get(protect, getInterviews)
  .post(protect, validateInterview, createInterview);

router.route("/:id")
  .get(protect, checkOwnership(Interview), getInterviewById)
  .put(protect, checkOwnership(Interview), validateInterview, updateInterview)
  .delete(protect, checkOwnership(Interview), deleteInterview);

module.exports = router;