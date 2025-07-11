module.exports = (socket) => {
    console.log("User connected to /notifications:", socket.id);
  
    socket.on("notification", (data) => {
      socket.broadcast.emit("new-notification", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected from /notifications:", socket.id);
    });
  };
  