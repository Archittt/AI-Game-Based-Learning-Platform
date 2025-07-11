module.exports = (socket) => {
    console.log("User connected to /game:", socket.id);
  
    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });
  
    socket.on("score-update", (data) => {
      socket.broadcast.emit("leaderboard-update", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected from /game:", socket.id);
    });
  };
  