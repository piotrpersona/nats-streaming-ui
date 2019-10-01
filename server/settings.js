const { getInstance } = require("nats-nerve");

const options = {
  server: process.env.STAN_URL || "nats://127.0.0.1:4222",
  monitor: process.env.STAN_MONITOR_URL || "http://127.0.0.1:8222",
  cluster: process.env.STAN_CLUSTER || "test-cluster",
  appName: "nats-streaming-ui"
};

const getNerveInstance = async () => {
  const { server, cluster, appName } = options;
  return getInstance(server, cluster, appName);
};

console.log({ options: options });

module.exports = { getNerveInstance, options };
