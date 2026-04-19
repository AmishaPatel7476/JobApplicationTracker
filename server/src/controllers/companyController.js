const Company = require("../models/Company");

const getCompanies = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const sort = req.query.sort || "newest";

    const query = {
      user: req.user._id
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "name_asc") {
      sortOption = { name: 1 };
    } else if (sort === "name_desc") {
      sortOption = { name: -1 };
    }

    const total = await Company.countDocuments(query);
    const pages = Math.ceil(total / limit);

    const companies = await Company.find(query)
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

    res.json(companies);
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    res.json(company);
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const { name, industry, location, website, notes } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Company name is required");
    }

    const company = await Company.create({
      name,
      industry,
      location,
      website,
      notes,
      user: req.user._id
    });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    company.name = req.body.name ?? company.name;
    company.industry = req.body.industry ?? company.industry;
    company.location = req.body.location ?? company.location;
    company.website = req.body.website ?? company.website;
    company.notes = req.body.notes ?? company.notes;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    await company.deleteOne();

    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};