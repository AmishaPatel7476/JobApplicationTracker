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

// ================= MAIN ROUTES =================

router.route("/")
  .get(protect, getApplications)
  .post(protect, validateApplication, createApplication); // ✅ validation added

router.route("/:id")
  .get(protect, checkOwnership(Application), getApplicationById) // ✅ ownership
  .put(
    protect,
    checkOwnership(Application),
    validateApplication,
    updateApplication
  )
  .delete(protect, checkOwnership(Application), deleteApplication);

// ================= NESTED ROUTE =================

// GET interviews for a specific application
router.get("/:applicationId/interviews", protect, async (req, res, next) => {
  try {
    // ✅ check ownership of application
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