const UserProgress = require("../../models/UserProgress");

exports.updateProgress = async (req, res) => {
  try {
    const { userId, moduleId, progressPercent } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { userId, moduleId },
      { progressPercent, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, progress });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.find({ userId });
    res.status(200).json({ success: true, progress });
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};