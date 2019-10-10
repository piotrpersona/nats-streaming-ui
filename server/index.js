const { createServer } = require("http");
const Socketio = require("socket.io");
const serveStatic = require("serve-static");
const finalhandler = require("finalhandler");

const { handler } = require("./events/sockets_handlers");

const serve = serveStatic("build", { index: ["index.html"] });

const app = createServer(async (req, res) => {
  serve(req, res, finalhandler(req, res));
});

const io = new Socketio(app);

io.on("connection", handler);

app.listen(8282, () => {
  console.log(
    `Server app was started at http://127.0.0.1:${app.address().port}`
  );
});
