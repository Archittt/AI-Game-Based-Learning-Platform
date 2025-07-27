const UserEngagement = require("../../models/UserEngagement");

exports.logEngagement = async (req, res) => {
  try {
    const engagement = await UserEngagement.create(req.body);
    res.status(201).json({ success: true, engagement });
  } catch (err) {
    console.error("Engagement log error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserEngagement = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await UserEngagement.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, logs });
  } catch (err) {
    console.error("Get engagement error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};