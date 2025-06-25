const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

const authenticate = require("./middlewares/authenticate");
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: `Hello user ${req.user.id}`, user: req.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/ai", moduleRoutes);
app.use("/api", rewardRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
