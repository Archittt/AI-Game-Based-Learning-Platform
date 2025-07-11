const mongoose = require("mongoose");
const User = require("../models/userModel");
const GameProgress = require("../models/gameProgress");
const QuizAttempt = require("../models/quizAttemptModel");
const { parse } = require("json2csv");
const { request } = require("express");

// Helper: Determine which students the current user can see
function studentFilter(req) {
  const { role, id: userId } = req.user;
  console.log(req.user);

  if (role === "teacher") {
    const grade = req.query.grade && parseInt(req.query.grade, 10);
    return { role: "user", ...(grade ? { grade } : {}) };
  }

  if (role === "parent") {
    return { role: "user", parents: new mongoose.Types.ObjectId(userId) };
  }

  throw new Error("Forbidden");
}

// 1) GET /students - summary list
exports.listStudents = async (req, res) => {
  let base;
  try {
    base = studentFilter(req);
  } catch {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const students = await User.find(base).select("_id name grade").lean();
    const ids = students.map((s) => s._id);

    const [progAgg, quizAgg] = await Promise.all([
      GameProgress.aggregate([
        { $match: { userId: { $in: ids } } },
        {
          $group: {
            _id: "$userId",
            avgScore: { $avg: "$score" },
            totalTime: { $sum: "$progressData.timeSpent" },
            challengesCompleted: { $sum: { $cond: ["$completed", 1, 0] } },
          },
        },
      ]),
      QuizAttempt.aggregate([
        { $match: { userId: { $in: ids } } },
        {
          $group: {
            _id: "$userId",
            avgQuizScore: { $avg: "$score" },
            totalQuizzes: { $sum: 1 },
          },
        },
      ]),
    ]);

    const byId = (arr) => (id) => arr.find((e) => e._id.toString() === id.toString()) || {};
    const pMap = byId(progAgg);
    const qMap = byId(quizAgg);

    const data = students.map((s) => ({
      id: s._id,
      name: s.name,
      grade: s.grade,
      avgScore: +(pMap(s._id).avgScore || 0).toFixed(1),
      totalTime: pMap(s._id).totalTime || 0,
      challengesCompleted: pMap(s._id).challengesCompleted || 0,
      avgQuizScore: +(qMap(s._id).avgQuizScore || 0).toFixed(1),
      totalQuizzes: qMap(s._id).totalQuizzes || 0,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2) GET /student/:id - details + intervention
exports.getStudentDetailsWithInterventions = async (req, res) => {
  let base;
  try {
    base = studentFilter(req);
  } catch {
    return res.status(403).json({ message: "Access denied" });
  }

  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  try {
    const student = await User.findOne({ _id: studentId, ...base })
      .select("_id name grade")
      .lean();
    if (!student) return res.status(403).json({ message: "Access denied" });

    const [progress, quizzes] = await Promise.all([
      GameProgress.find({ userId: student._id }).lean(),
      QuizAttempt.find({ userId: student._id }).lean(),
    ]);

    const avgScoreResult = await GameProgress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(student._id) } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]);
    const avgScore = avgScoreResult[0]?.avgScore || 0;

    const intervention = {
      needsHelp: avgScore < 50,
      reason: avgScore < 50 ? "Average score below 50%" : null,
      suggestion: avgScore < 50 ? "Recommend targeted practice on weaker modules" : null,
    };

    res.json({ student, progress, quizzes, intervention });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3) GET /reports/:id - single-student report
exports.getStudentReport = async (req, res) => {
  let base;
  try {
    base = studentFilter(req);
  } catch {
    return res.status(403).json({ message: "Access denied" });
  }

  const studentId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const allowed = await User.exists({ _id: studentId, ...base });
  if (!allowed) return res.status(403).json({ message: "Access denied" });

  const { dateFrom, dateTo, metrics = "", format = "json" } = req.query;
  const metricList = metrics.split(",").map((m) => m.trim()).filter(Boolean);

  try {
    const matchProg = { userId: new mongoose.Types.ObjectId(studentId) };
    if (dateFrom || dateTo) {
      matchProg.updatedAt = {};
      if (dateFrom) matchProg.updatedAt.$gte = new Date(dateFrom);
      if (dateTo) matchProg.updatedAt.$lte = new Date(dateTo);
    }

    const matchQuiz = { userId: new mongoose.Types.ObjectId(studentId) };
    if (dateFrom || dateTo) {
      matchQuiz.attemptedAt = matchProg.updatedAt;
    }

    const [progAgg] = await GameProgress.aggregate([
      { $match: matchProg },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
          totalTime: { $sum: "$progressData.timeSpent" },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
        },
      },
    ]);

    const [quizAgg] = await QuizAttempt.aggregate([
      { $match: matchQuiz },
      {
        $group: {
          _id: null,
          avgQuizScore: { $avg: "$score" },
          totalQuizzes: { $sum: 1 },
        },
      },
    ]);

    const report = { studentId, dateFrom, dateTo };
    if (metricList.includes("avgScore")) report.avgScore = +(progAgg?.avgScore || 0).toFixed(1);
    if (metricList.includes("totalTime")) report.totalTime = progAgg?.totalTime || 0;
    if (metricList.includes("challenges")) report.challenges = progAgg?.completed || 0;
    if (metricList.includes("avgQuizScore")) report.avgQuizScore = +(quizAgg?.avgQuizScore || 0).toFixed(1);
    if (metricList.includes("totalQuizzes")) report.totalQuizzes = quizAgg?.totalQuizzes || 0;

    if (format === "csv") {
      const csv = parse([report]);
      res.header("Content-Type", "text/csv").send(csv);
    } else {
      res.json(report);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
