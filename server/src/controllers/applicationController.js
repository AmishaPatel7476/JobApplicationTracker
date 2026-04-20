const Application = require("../models/Application");
const Company = require("../models/Company");

const getApplications = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "newest";

    const query = {
      user: req.user._id
    };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { roleTitle: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "salaryHigh") {
      sortOption = { salaryExpectation: -1 };
    } else if (sort === "salaryLow") {
      sortOption = { salaryExpectation: 1 };
    }

    const total = await Application.countDocuments(query);
    const pages = Math.ceil(total / limit);

    const applications = await Application.find(query)
      .populate("company", "name industry location")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const params = new URLSearchParams(req.query);
    const links = [];

    if (page > 1) {
      params.set("page", page - 1);
      params.set("limit", limit);
      links.push(`<${baseUrl}?${params.toString()}>; rel="prev"`);
    }

    if (page < pages) {
      params.set("page", page + 1);
      params.set("limit", limit);
      links.push(`<${baseUrl}?${params.toString()}>; rel="next"`);
    }

    params.set("page", 1);
    params.set("limit", limit);
    links.push(`<${baseUrl}?${params.toString()}>; rel="first"`);

    params.set("page", pages || 1);
    params.set("limit", limit);
    links.push(`<${baseUrl}?${params.toString()}>; rel="last"`);

    res.set("X-Total-Count", total.toString());
    res.set("X-Total-Pages", pages.toString());
    res.set("X-Current-Page", page.toString());

    if (links.length > 0) {
      res.set("Link", links.join(", "));
    }

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("company", "name industry location");

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

const createApplication = async (req, res, next) => {
  try {
    const {
      roleTitle,
      status,
      applicationDate,
      salaryExpectation,
      notes,
      company
    } = req.body;

    if (!roleTitle || !applicationDate || !company) {
      res.status(400);
      throw new Error("Role title, application date, and company are required");
    }

    const existingCompany = await Company.findOne({
      _id: company,
      user: req.user._id
    });

    if (!existingCompany) {
      res.status(404);
      throw new Error("Company not found");
    }

    const application = await Application.create({
      roleTitle,
      status,
      applicationDate,
      salaryExpectation,
      notes,
      company,
      user: req.user._id
    });

    const populatedApplication = await Application.findById(application._id)
      .populate("company", "name industry location");

    res.status(201).json(populatedApplication);
  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    if (req.body.company) {
      const existingCompany = await Company.findOne({
        _id: req.body.company,
        user: req.user._id
      });

      if (!existingCompany) {
        res.status(404);
        throw new Error("Company not found");
      }

      application.company = req.body.company;
    }

    application.roleTitle = req.body.roleTitle ?? application.roleTitle;
    application.status = req.body.status ?? application.status;
    application.applicationDate = req.body.applicationDate ?? application.applicationDate;
    application.salaryExpectation = req.body.salaryExpectation ?? application.salaryExpectation;
    application.notes = req.body.notes ?? application.notes;

    const updatedApplication = await application.save();

    const populatedApplication = await Application.findById(updatedApplication._id)
      .populate("company", "name industry location");

    res.json(populatedApplication);
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      res.status(404);
      throw new Error("Application not found");
    }

    await application.deleteOne();

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
};