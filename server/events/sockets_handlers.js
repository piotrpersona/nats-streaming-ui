const axios = require("axios");
const { getNerveInstance, options } = require("../settings");

const history = {};

const handler = async client => {
  const nerve = await getNerveInstance().catch(e => {
    console.log(e);
  });
  /**
   * @desc creating new channel
   */
  const createChannel = async data => {
    await nerve.publisher.publish(data.channelName, "\n");

    history[data.channelName] = [];

    await nerve.subscribe(data.channelName, msg => {
      console.log(`subs channel: ${data.channelName}. msg: ${Object.getOwnPropertyNames(msg)}`)
      
      history[data.channelName].push({
        sequence: msg.getSequence(),
        timestamp: msg.getTimestamp(),
        subject: msg.getSubject(),
        data: msg.getData(),
        isRedelivered: msg.isRedelivered()
      });
    });

    client.emit("channel_created");
  };

  /**
   * @desc sending message to the channel
   */
  const sendMessage = async data => {
    await nerve.publisher.publish(data.channelName, data.message);
    client.emit("message_sent");
  };

  /**
   * @desc getting channels
   */
  const getChannels = async () => {
    const resp = await axios({
      method: "get",
      baseURL: options.monitor,
      url: "/streaming/channelsz?subs=1",
      headers: { Accept: "application/json" },
      proxy: false
    });

    client.emit("channels_received", { channels: resp.data.channels });
  };

  /**
   * @desc getting subscriptions
   */
  const getSubscription = async () => {
    const resp = await axios({
      method: "get",
      baseURL: options.monitor,
      url: "/streaming/channelsz?subs=1",
      headers: { Accept: "application/json" },
      proxy: false
    });

    let subscriptions = [];

    if (resp.data.channels) {
      resp.data.channels.forEach(channel => {
        if (Array.isArray(channel.subscriptions)) {
          subscriptions.push(
            ...channel.subscriptions.map(subscriptions => {
              subscriptions.channel_name = channel.name;
              return subscriptions;
            })
          );
        }
      });
    }

    client.emit("subscriptions_received", { subscriptions });
  };

  /**
   * @desc getting clients
   */
  const getClients = async () => {
    const resp = await axios({
      method: "get",
      baseURL: options.monitor,
      url: "/streaming/clientsz?subs=1",
      headers: { Accept: "application/json" },
      proxy: false
    });

    const clients = resp.data.clients.map(client => {
      return {
        id: client.id,
        inbox: client.hb_inbox,
        subscriptions_number: client.subscriptions
          ? Object.keys(client.subscriptions).length
          : 0,
        subscriptions: client.subscriptions
      };
    });

    client.emit("clients_received", { clients });
  };

  /**
   * @desc getting dashboards data
   */
  const getDashboard = async () => {
    try {
      const resp = await axios({
        method: "get",
        baseURL: options.monitor,
        url: "/streaming/serverz",
        headers: { Accept: "application/json" },
        proxy: false
      });
      const store = await axios({
        method: "get",
        baseURL: options.monitor,
        url: "/streaming/storez",
        headers: { Accept: "application/json" },
        proxy: false
      });

      const {
        clients,
        subscriptions,
        channels,
        total_msgs,
        total_bytes,
        uptime,
        cluster_id,
        server_id,
        version,
        go,
        state
      } = resp.data;

      client.emit("dashboard_received", {
        clients,
        channels,
        subscriptions,
        messages: total_msgs,
        size: total_bytes,
        uptime,
        cluster_id,
        server_id,
        version,
        go_version: go,
        state,
        store: {
          type: store.data.type,
          limits: store.data.limits
        }
      });
    } catch (e) {
      console.error(e.message);
      console.log(`history: ${JSON.stringify(history)}`);
    }
  };

  /**
   * @desc Getting messages for channel
   * @param data
   * @returns {Promise<void>}
   */
  const getMessages = async data => {
    const messages = [];

    try {
      const response = await axios({
        method: "get",
        baseURL: options.monitor,
        url: `/streaming/channelsz?channel=${data.channelName}`,
        headers: { Accept: "application/json" },
        proxy: false
      });

      const numOfMessages = response.data.msgs;

      await nerve.subscribe(data.channelName, msg => {
        messages.push({
          sequence: msg.getSequence(),
          timestamp: msg.getTimestamp(),
          subject: msg.getSubject(),
          data: msg.getData(),
          isRedelivered: msg.isRedelivered()
        });

        if (numOfMessages === messages.length) {
          client.emit("messages_received", messages);
        }
      });
    } catch {
      client.emit("messages_received", history[data.channelName].sort((a, b) => b.sequence - a.sequence) || []);
    }
  };

  /**
   * @desc Checking Nats server status
   * @returns {Promise<void>}
   */
  const isOnline = async () => {
    const isConnected = nerve.conn.nc.connected || false;
    client.emit("is_online_result", isConnected);
  };

  client.on("create_channel", createChannel);
  client.on("send_message", sendMessage);
  client.on("get_channels", getChannels);
  client.on("get_subscriptions", getSubscription);
  client.on("get_clients", getClients);
  client.on("get_dashboard", getDashboard);
  client.on("get_messages", getMessages);
  client.on("is_online", isOnline);
};

module.exports = { handler };
