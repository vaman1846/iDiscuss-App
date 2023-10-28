const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Import the cors module

const app = express();
const server = http.createServer(app);
// const io = socketIo(server);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const users = {};

// Allow requests from any origin
app.use(cors());

io.on("connection", (socket) => {
  // If any new user joined, let other users connected to the server know
  socket.on("new-user-joined", (name) => {
    console.log("New User", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // If someone send a message, broadcast it to other people
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // If someone leaves the chat, let others know
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log("Socket.io server is running on port 8000");
});
