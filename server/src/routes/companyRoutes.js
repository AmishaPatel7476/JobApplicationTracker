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
const { validateCompany, validateApplication } = require("../middleware/validationMiddleware");
const { checkOwnership } = require("../middleware/ownershipMiddleware");

const Company = require("../models/Company");
const Application = require("../models/Application");

router.route("/")
  .get(protect, getCompanies)
  .post(protect, validateCompany, createCompany);

router.route("/:id")
  .get(protect, checkOwnership(Company), getCompanyById)
  .put(protect, checkOwnership(Company), validateCompany, updateCompany)
  .delete(protect, checkOwnership(Company), deleteCompany);

// Nested route: get applications for a company
router.get("/:companyId/applications", protect, async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.companyId,
      user: req.user._id
    });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

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
    const company = await Company.findOne({
      _id: req.params.companyId,
      user: req.user._id
    });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    req.body.company = req.params.companyId;

    validateApplication(req, res, async () => {
      const {
        roleTitle,
        status,
        applicationDate,
        salaryExpectation,
        notes
      } = req.body;

      const application = await Application.create({
        roleTitle,
        status,
        applicationDate,
        salaryExpectation,
        notes,
        company: req.params.companyId,
        user: req.user._id
      });

      const populatedApplication = await Application.findById(application._id)
        .populate("company", "name industry location");

      res.status(201).json(populatedApplication);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;