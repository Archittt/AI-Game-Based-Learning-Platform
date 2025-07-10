// controllers/dashboardController.js
const mongoose      = require("mongoose");
const User          = require("../models/userModel");
const GameProgress  = require("../models/gameProgress");
const QuizAttempt   = require("../models/quizAttemptModel");
const { parse }     = require("json2csv");

/** helper: filter for which students this user may see */
function studentFilter(req) {
  const { role, id: userId } = req.user;
  if (role === "teacher") {
    const grade = req.query.grade && parseInt(req.query.grade, 10);
    return { role: "user", ...(grade ? { grade } : {}) };
  }
  if (role === "parent") {
    return { role: "user", parents: mongoose.Types.ObjectId(userId) };
  }
  throw new Error("Forbidden");
}

// 1) GET /students
exports.listStudents = async (req, res) => {
  let base;
  try { base = studentFilter(req); }
  catch { return res.status(403).json({ message: "Access denied" }); }

  try {
    const students = await User.find(base).select("_id name grade").lean();
    const ids = students.map(s => s._id);

    const [progAgg, quizAgg] = await Promise.all([
      GameProgress.aggregate([
        { $match: { userId: { $in: ids } } },
        { $group: {
            _id: "$userId",
            avgScore:            { $avg: "$score" },
            totalTime:           { $sum: "$progressData.timeSpent" },
            challengesCompleted: { $sum: { $cond: ["$completed",1,0] } }
        }}
      ]),
      QuizAttempt.aggregate([
        { $match: { userId: { $in: ids } } },
        { $group: {
            _id: "$userId",
            avgQuizScore: { $avg: "$score" },
            totalQuizzes: { $sum: 1 }
        }}
      ])
    ]);

    const byId = arr => id => arr.find(e => e._id.toString() === id.toString()) || {};
    const pMap = byId(progAgg), qMap = byId(quizAgg);

    const data = students.map(s => ({
      id:                 s._id,
      name:               s.name,
      grade:              s.grade,
      avgScore:           +(pMap(s._id).avgScore || 0).toFixed(1),
      totalTime:          pMap(s._id).totalTime || 0,
      challengesCompleted:pMap(s._id).challengesCompleted || 0,
      avgQuizScore:       +(qMap(s._id).avgQuizScore || 0).toFixed(1),
      totalQuizzes:       qMap(s._id).totalQuizzes || 0
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2) GET /student/:id  → details + interventions
exports.getStudentDetailsWithInterventions = async (req, res) => {
  let base;
  try { base = studentFilter(req); }
  catch { return res.status(403).json({ message: "Access denied" }); }

  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  try {
    // ensure allowed
    const student = await User.findOne({ _id: studentId, ...base })
                              .select("_id name grade")
                              .lean();
    if (!student) return res.status(403).json({ message: "Access denied" });

    // fetch progress & quizzes
    const [progress, quizzes] = await Promise.all([
      GameProgress.find({ userId: student._id }).lean(),
      QuizAttempt.find({ userId: student._id }).lean()
    ]);

    // compute intervention flag
    const avgScoreResult = await GameProgress.aggregate([
      { $match: { userId: student._id } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);
    const avgScore = avgScoreResult[0]?.avgScore || 0;
    const intervention = {
      needsHelp: avgScore < 50,
      reason:    avgScore < 50 ? "Average score below 50%" : null,
      suggestion: avgScore < 50
        ? "Recommend targeted practice on weaker modules"
        : null
    };

    res.json({ student, progress, quizzes, intervention });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3) GET /reports/:id  → single‐student report
exports.getStudentReport = async (req, res) => {
  let base;
  try { base = studentFilter(req); }
  catch { return res.status(403).json({ message: "Access denied" }); }

  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  // ensure allowed
  const allowed = await User.exists({ _id: studentId, ...base });
  if (!allowed) return res.status(403).json({ message: "Access denied" });

  // parse query params
  const { dateFrom, dateTo, metrics = "", format = "json" } = req.query;
  const metricList = metrics.split(",").map(m => m.trim()).filter(Boolean);

  try {
    // build match stages
    const matchProg = { userId: mongoose.Types.ObjectId(studentId) };
    if (dateFrom || dateTo) {
      matchProg.updatedAt = {};
      if (dateFrom) matchProg.updatedAt.$gte = new Date(dateFrom);
      if (dateTo)   matchProg.updatedAt.$lte = new Date(dateTo);
    }

    const matchQuiz = { userId: mongoose.Types.ObjectId(studentId) };
    if (dateFrom || dateTo) {
      matchQuiz.attemptedAt = matchProg.updatedAt;
    }

    // run aggregations
    const [progAgg] = await GameProgress.aggregate([
      { $match: matchProg },
      { $group: {
          _id: null,
          avgScore: { $avg: "$score" },
          totalTime:{ $sum: "$progressData.timeSpent" },
          completed:{ $sum: { $cond:["$completed",1,0] }}
      }}
    ]);

    const [quizAgg] = await QuizAttempt.aggregate([
      { $match: matchQuiz },
      { $group: {
          _id: null,
          avgQuizScore:{ $avg:"$score" },
          totalQuizzes:{ $sum:1 }
      }}
    ]);

    // pick requested metrics
    const report = { studentId, dateFrom, dateTo };
    if (metricList.includes("avgScore"))      report.avgScore      = +(progAgg?.avgScore     || 0).toFixed(1);
    if (metricList.includes("totalTime"))     report.totalTime     = progAgg?.totalTime    || 0;
    if (metricList.includes("challenges"))    report.challenges    = progAgg?.completed    || 0;
    if (metricList.includes("avgQuizScore"))  report.avgQuizScore  = +(quizAgg?.avgQuizScore|| 0).toFixed(1);
    if (metricList.includes("totalQuizzes"))  report.totalQuizzes  = quizAgg?.totalQuizzes  || 0;

    // format
    if (format === "csv") {
      const csv = parse([report]);
      res.header("Content-Type","text/csv").send(csv);
    } else {
      res.json(report);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
