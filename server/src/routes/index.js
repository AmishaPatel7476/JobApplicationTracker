const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const companyRoutes = require("./companyRoutes");
const applicationRoutes = require("./applicationRoutes");
const interviewRoutes = require("./interviewRoutes");

router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);
router.use("/applications", applicationRoutes);
router.use("/interviews", interviewRoutes);

module.exports = router;