const axios = require("axios");
const { getNerveInstance, options } = require("../settings");

const memory = [];
let monitoring = true;

const handler = async client => {
  const nerve = await getNerveInstance().catch(e => {
    console.error(e);
  });
  /**
   * @desc creating new channel
   */
  const createChannel = async data => {
    console.log('createChannel');

    if (monitoring) {
      await nerve.publisher.publish(data.channelName, "\n");
    } else {
      const channel = { name: data.channelName, messages: [] }
      memory.push(channel);
      await nerve.subscribe(channel.name, msg => {
        channel.messages.push({
          sequence: msg.getSequence(),
          timestamp: msg.getTimestamp(),
          subject: msg.getSubject(),
          data: msg.getData(),
          isRedelivered: msg.isRedelivered()
        });
      });
    }

    client.emit("channel_created");
  };

  /**
   * @desc sending message to the channel
   */
  const sendMessage = async data => {
    console.log('sendMessage');
    await nerve.publisher.publish(data.channelName, data.message);
    client.emit("message_sent");
  };

  /**
   * @desc getting channels
   */
  const getChannels = async () => {
    console.log('getChannels');
    try {
      const resp = await axios({
        method: "get",
        baseURL: options.monitor,
        url: "/streaming/channelsz?subs=1",
        headers: { Accept: "application/json" },
        proxy: false
      });
      client.emit("channels_received", { channels: resp.data.channels });
    } catch (e) {
      client.emit("channels_received", { channels: memory });
    }
  };

  /**
   * @desc getting subscriptions
   */
  const getSubscription = async () => {
    console.log('getSubscription');
    try {
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
    } catch (e) {

    }
  };

  /**
   * @desc getting clients
   */
  const getClients = async () => {
    console.log('getClients');
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
    console.log('getDashboard');
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
    }
  };

  /**
   * @desc Getting messages for channel
   * @param data
   * @returns {Promise<void>}
   */
  const getMessages = async data => {
    console.log('getMessages');
    const messages = [];
    let response;
    try {
      try {
        response = await axios({
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
      } catch (e) {
        const channel = memory.find(c => c.name === data.channelName);
        if (channel){
          messages.push(...channel.messages.sort((a, b) => b.sequence - a.sequence))
        }
        client.emit("messages_received", messages);
      }
    } catch {
      client.emit("messages_received", []);
    }
  };

  /**
   * @desc Checking Nats server status
   * @returns {Promise<void>}
   */
  const isOnline = async () => {
    try{
      const isConnected = nerve.conn.nc.connected || false;
      client.emit("is_online_result", isConnected);
    }catch (e) { }
  };

  const isMonitoring = async () => {
    try {
      const resp = await axios({
        method: "get",
        baseURL: options.monitor,
        url: "/streaming/serverz",
        headers: { Accept: "application/json" },
        proxy: false
      });
      return resp.status === 200;
    } catch (error) {
      return false;
    }
  }

  client.on("create_channel", createChannel);
  client.on("send_message", sendMessage);
  client.on("get_channels", getChannels);
  client.on("get_subscriptions", getSubscription);
  client.on("get_clients", getClients);
  client.on("get_dashboard", getDashboard);
  client.on("get_messages", getMessages);
  client.on("is_online", isOnline);

  monitoring = await isMonitoring();
};

module.exports = { handler };
