module.exports = (socket) => {
    console.log("User connected to /chat:", socket.id);
  
    socket.on("send-message", (data) => {
      socket.to(data.roomId).emit("receive-message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected from /chat:", socket.id);
    });
  };
  