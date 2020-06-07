const { createServer } = require("http");
const Socketio = require("socket.io");
const serveStatic = require("serve-static");
const finalhandler = require("finalhandler");

const { handler } = require("./events/sockets_handlers");

const serve = serveStatic("build", { index: ["index.html"] });

const app = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  serve(req, res, finalhandler(req, res));
});

app.listen(8282, () => {
  console.log(
    `Server app was started at http://127.0.0.1:${app.address().port}`
  );
});

const io = new Socketio(app);

io.on("connection", handler);
