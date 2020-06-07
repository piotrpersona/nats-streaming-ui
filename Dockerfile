FROM node:current-alpine

COPY . /opt/nats-streaming-ui

RUN yarn global add pm2

WORKDIR /opt/nats-streaming-ui

RUN yarn install && yarn run build:react
RUN chmod +x ./makeRealIP.sh

EXPOSE 8282

ENTRYPOINT /opt/nats-streaming-ui/makeRealIP.sh && pm2-docker start pm2.ecosystem.yaml
