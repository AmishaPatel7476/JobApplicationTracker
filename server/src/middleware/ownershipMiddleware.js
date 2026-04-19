const Application = require("../models/Application");
const Company = require("../models/Company");
const Interview = require("../models/Interview");

// Generic ownership checker
const checkOwnership = (Model, field = "user") => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        res.status(404);
        throw new Error("Resource not found");
      }

      // Special case: Interview → check via application.user
      if (Model.modelName === "Interview") {
        const interview = await Interview.findById(req.params.id)
          .populate("application");

        if (
          !interview.application ||
          interview.application.user.toString() !== req.user._id.toString()
        ) {
          res.status(403);
          throw new Error("Not authorized");
        }
      } else {
        if (resource[field].toString() !== req.user._id.toString()) {
          res.status(403);
          throw new Error("Not authorized");
        }
      }

      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { checkOwnership };