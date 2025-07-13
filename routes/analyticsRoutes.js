const express = require("express");
const router = express.Router();

const {
  getUserEngagement,
  logEngagement
} = require("../controllers/analytics/engagementController");

const {
  getUserOutcomes,
  logOutcome
} = require("../controllers/analytics/outcomeController");

const {
  getUserProgress,
  updateProgress
} = require("../controllers/analytics/progressController");

const {
  getAnalyticsOverview
} = require("../controllers/analytics/overviewController");

// Engagement APIs
router.post("/engagement", logEngagement);
router.get("/engagement/:userId", getUserEngagement);

// Learning Outcomes APIs
router.post("/outcomes", logOutcome);
router.get("/outcomes/:userId", getUserOutcomes);

// Progress APIs
router.post("/progress", updateProgress);
router.get("/progress/:userId", getUserProgress);

// Aggregated Dashboard API
router.get("/overview/:userId", getAnalyticsOverview);

module.exports = router;
