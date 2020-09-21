# NATS Streaming UI

Powerful dashboard for the [Nats Streaming](https://nats-io.github.io/docs/nats_streaming/intro.html)

<a href="https://www.npmjs.com/package/nats-streaming-ui"><img src="https://badgen.net/npm/v/nats-streaming-ui?icon=npm&label" alt="NPM" title="NPM" /></a>
<img src="https://badgen.net/npm/license/nats-streaming-ui" />

<img src="https://gitlab.com/united-travel-tickets/common/nats-streaming-ui/raw/master/docs/screenshots.gif" alt="Nats Streaming UI" />

## Features

- Dashboard - some metrics like number of messages, channels, subscriptions, etc.
- Channels - channels list, ability to create new channel, push message to the queue
- Subscriptions
- Clients

## How to run with Docker

```shell script
docker run -p 8282:8282 \
  -e STAN_URL=http://nats-url:4222 \
  -e STAN_MONITOR_URL=http://nats-url:8222 \
  -e STAN_CLUSTER=test-cluster \
  piotrpersona/nats-streaming-ui:latest
```

Follow the link http://127.0.0.1:8282

## How to run locally

```shell script
git https://gitlab.com/united-travel-tickets/common/nats-streaming-ui.git
cd nats-streaming-ui
yarn run build:react
node ./server/index.js
```

## Issues

Let us know about any issues by [GitLab](https://gitlab.com/united-travel-tickets/common/nats-streaming-ui/issues)

## Credits

- [Origin](https://gitlab.com/united-travel-tickets/common/nats-streaming-ui)
- [React](https://reactjs.org)
- [Socket.io](https://socket.io/)
- [Express](https://expressjs.com)
- [material-ui](https://material-ui.com/)
- [nats-nerve](https://www.npmjs.com/package/nats-nerve)
- [shortid](https://www.npmjs.com/package/shortid)
- [axios](https://www.npmjs.com/package/axios)
- [clsx](https://www.npmjs.com/package/clsx)

## Inspired By

- [GitLab original source](https://gitlab.com/united-travel-tickets/common/nats-streaming-ui)
- [nats-streaming-console by KualiCo](https://github.com/KualiCo/nats-streaming-console)
- Google Cloud Pub/Sub
