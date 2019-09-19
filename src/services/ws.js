import openSocket from "socket.io-client";
const socket = openSocket("ws://localhost:8282/");

const getDashboard = cb => {
  socket.emit("get_dashboard");
  socket.on("dashboard_received", message => {
    cb(message);
  });
};

const getChannels = cb => {
  socket.emit("get_channels");
  socket.on("channels_received", message => {
    cb(message);
  });
};

const getSubscriptions = cb => {
  socket.emit("get_subscriptions");
  socket.on("subscriptions_received", message => {
    cb(message);
  });
};

const addChannel = (channelName, cb) => {
  socket.emit("create_channel", { channelName });
  socket.on("channel_created", message => {
    cb(message);
  });
};

export { getDashboard, getChannels, addChannel, getSubscriptions };
