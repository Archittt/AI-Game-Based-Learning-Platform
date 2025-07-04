const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
//socket.io
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Routes and Middleware
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const authenticate = require("./middlewares/authenticate");
const chatbotRoutes = require("./routes/chatbotRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const aiIntegrationRoutes = require("./routes/aiIntegrationRoutes");
const quizChallengeRoutes = require("./routes/quizChallengeRoutes");

// Test protected route
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: `Hello user ${req.user.id}`, user: req.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/ai", moduleRoutes);
app.use("/api", rewardRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", aiIntegrationRoutes);
app.use("/api/quiz", quizChallengeRoutes);


// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log(" New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(" User ${userId} joined their room");
  });

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(" User join their room ${room}");
  });

  socket.on("score-update", (data) => {
    console.log(" Score update received:", data);
    // Broadcast to all clients
    io.emit("leaderboard-update", data);
  });

  socket.on("notification", (data) => {
    io.emit("new-notification", data);
  });

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

//Export io to use in routes 
app.set('io', io);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
