const UserOutcome = require("../../models/UserOutcome");

exports.logOutcome = async (req, res) => {
  try {
    const outcome = await UserOutcome.create(req.body);
    res.status(201).json({ success: true, outcome });
  } catch (err) {
    console.error("Outcome log error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserOutcomes = async (req, res) => {
  try {
    const { userId } = req.params;
    const outcomes = await UserOutcome.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, outcomes });
  } catch (err) {
    console.error("Get outcome error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};