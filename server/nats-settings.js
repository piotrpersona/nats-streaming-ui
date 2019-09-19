const { getInstance } = require("nats-nerve");

const defaults = {
  server: process.env.STAN_URL || "nats://localhost:4222",
  monitor: process.env.STAN_MONITOR_URL || "http://localhost:8222",
  cluster: process.env.STAN_CLUSTER || "test-cluster",
  appName: "nats-streaming-ui"
};

const options = Object.assign({}, defaults);

const getNerveInstance = async () => {
  const { server, cluster, appName } = options;
  return getInstance(server, cluster, appName);
};

console.log({ options: options });

module.exports = { getNerveInstance, options };
