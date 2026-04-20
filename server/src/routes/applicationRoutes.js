const express = require("express");
const router = express.Router();

const Interview = require("../models/Interview");
const Application = require("../models/Application");

const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const { validateApplication } = require("../middleware/validationMiddleware");
const { checkOwnership } = require("../middleware/ownershipMiddleware");

// main routes

router.route("/")
  .get(protect, getApplications)
  .post(protect, validateApplication, createApplication); 

router.route("/:id")
  .get(protect, checkOwnership(Application), getApplicationById) 
  .put(
    protect,
    checkOwnership(Application),
    validateApplication,
    updateApplication
  )
  .delete(protect, checkOwnership(Application), deleteApplication);

// nested route for interviews of a specific application

// GET interviews for a specific application
router.get("/:applicationId/interviews", protect, async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      user: req.user._id
    });

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    const interviews = await Interview.find({
      application: req.params.applicationId
    }).populate({
      path: "application",
      populate: {
        path: "company",
        select: "name industry location"
      }
    });

    res.json(interviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;