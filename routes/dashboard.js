// routes/dashboard.js
const express         = require("express");
const router          = express.Router();
const  authenticate = require("../middlewares/authenticate");
const dashboardCtrl   = require("../controllers/dashboardController");

router.use(authenticate);

// 1. GET /students
router.get("/students",      dashboardCtrl.listStudents);

// 2. GET /student/:id   → details + interventions
router.get("/student/:id",   dashboardCtrl.getStudentDetailsWithInterventions);

// 3. GET /reports/:id   → single‐student report
router.get("/reports/:id",   dashboardCtrl.getStudentReport);

module.exports = router;
