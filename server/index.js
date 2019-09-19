const { Server } = require("http");
const express = require("express");
const socketio = require("socket.io");

const { handler } = require("./events/sockets_handlers");

const app = express();
const http = Server(app);

app.use(express.static("build"));

const io = socketio(http);
io.on("connection", handler);

const server = http.listen(8282, () => {
  console.log(
    `Server app was started at http://127.0.0.1:${server.address().port}`
  );
});