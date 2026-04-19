const Interview = require("../models/Interview");
const Application = require("../models/Application");

const getInterviews = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 5, 1);
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const sort = req.query.sort || "newest";

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { interviewDate: 1 };
    }

    const interviews = await Interview.find()
      .populate({
        path: "application",
        match: { user: req.user._id },
        populate: {
          path: "company",
          select: "name industry location"
        }
      })
      .sort(sortOption);

    let filteredInterviews = interviews.filter(
      (interview) => interview.application !== null
    );

    if (search) {
      filteredInterviews = filteredInterviews.filter((interview) =>
      interview.round?.toLowerCase().includes(search.toLowerCase()) ||
      interview.outcome?.toLowerCase().includes(search.toLowerCase())
    );
  }

    const total = filteredInterviews.length;
    const pages = Math.ceil(total / limit);
    const paginatedInterviews = filteredInterviews.slice(skip, skip + limit);

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

    res.json(paginatedInterviews);
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate({
      path: "application",
      populate: {
        path: "company",
        select: "name industry location"
      }
    });

    if (!interview) {
      res.status(404);
      throw new Error("Interview not found");
    }

    if (
      !interview.application ||
      interview.application.user.toString() !== req.user._id.toString()
    ) {
      res.status(404);
      throw new Error("Interview not found");
    }

    res.json(interview);
  } catch (error) {
    next(error);
  }
};

const createInterview = async (req, res, next) => {
  try {
    const { round, interviewDate, mode, outcome, notes, application } = req.body;

    if (!round || !interviewDate || !mode || !application) {
      res.status(400);
      throw new Error("Round, interview date, mode, and application are required");
    }

    const existingApplication = await Application.findOne({
      _id: application,
      user: req.user._id
    });

    if (!existingApplication) {
      res.status(404);
      throw new Error("Application not found");
    }

    const interview = await Interview.create({
      round,
      interviewDate,
      mode,
      outcome,
      notes,
      application
    });

    const populatedInterview = await Interview.findById(interview._id).populate({
      path: "application",
      populate: {
        path: "company",
        select: "name industry location"
      }
    });

    res.status(201).json(populatedInterview);
  } catch (error) {
    next(error);
  }
};

const updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("application");

    if (!interview) {
      res.status(404);
      throw new Error("Interview not found");
    }

    if (
      !interview.application ||
      interview.application.user.toString() !== req.user._id.toString()
    ) {
      res.status(404);
      throw new Error("Interview not found");
    }

    if (req.body.application) {
      const existingApplication = await Application.findOne({
        _id: req.body.application,
        user: req.user._id
      });

      if (!existingApplication) {
        res.status(404);
        throw new Error("Application not found");
      }

      interview.application = req.body.application;
    }

    interview.round = req.body.round ?? interview.round;
    interview.interviewDate = req.body.interviewDate ?? interview.interviewDate;
    interview.mode = req.body.mode ?? interview.mode;
    interview.outcome = req.body.outcome ?? interview.outcome;
    interview.notes = req.body.notes ?? interview.notes;

    const updatedInterview = await interview.save();

    const populatedInterview = await Interview.findById(updatedInterview._id).populate({
      path: "application",
      populate: {
        path: "company",
        select: "name industry location"
      }
    });

    res.json(populatedInterview);
  } catch (error) {
    next(error);
  }
};

const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("application");

    if (!interview) {
      res.status(404);
      throw new Error("Interview not found");
    }

    if (
      !interview.application ||
      interview.application.user.toString() !== req.user._id.toString()
    ) {
      res.status(404);
      throw new Error("Interview not found");
    }

    await interview.deleteOne();

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview
};