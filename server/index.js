const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN ROOM
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // REAL-TIME CODE SYNC
  socket.on("send_code", (data) => {
    const { room, code } = data;
    socket.to(room).emit("receive_code", code);
  });

  // CHAT MESSAGE
  socket.on("send_message", (data) => {
    const { room, message } = data;
    socket.to(room).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server started on port 5000");
});