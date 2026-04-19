const express = require("express");
const router = express.Router();

const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

const { protect } = require("../middleware/authMiddleware");
const Company = require("../models/Company");
const Application = require("../models/Application");

router.route("/")
  .get(protect, getCompanies)
  .post(protect, createCompany);

router.route("/:id")
  .get(protect, getCompanyById)
  .put(protect, updateCompany)
  .delete(protect, deleteCompany);

// Nested route: get applications for a company
router.get("/:companyId/applications", protect, async (req, res, next) => {
  try {
    const applications = await Application.find({
      company: req.params.companyId,
      user: req.user._id
    }).populate("company", "name industry location");

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// Nested route: create application for a company
router.post("/:companyId/applications", protect, async (req, res, next) => {
  try {
    const {
      roleTitle,
      status,
      applicationDate,
      salaryExpectation,
      resumeVersion,
      notes
    } = req.body;

    if (!roleTitle || !applicationDate) {
      res.status(400);
      throw new Error("Role title and application date are required");
    }

    const company = await Company.findOne({
      _id: req.params.companyId,
      user: req.user._id
    });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    const application = await Application.create({
      roleTitle,
      status,
      applicationDate,
      salaryExpectation,
      resumeVersion,
      notes,
      company: req.params.companyId,
      user: req.user._id
    });

    const populatedApplication = await Application.findById(application._id)
      .populate("company", "name industry location");

    res.status(201).json(populatedApplication);
  } catch (error) {
    next(error);
  }
});

module.exports = router;