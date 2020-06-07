import React from "react";
import clsx from "clsx";

import { withRouter } from "react-router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { DashboardItem } from "./DashboardItem";

import { socket } from "../../services/ws";

class Dashboard extends React.Component {
  state = { dashboard: null, counter: null, socket: null };

  update() {
    this.socket.emit("get_dashboard");
    this.socket.on("dashboard_received", data => {
      this.setState({
        dashboard: data
      });
    });
  }

  componentDidMount() {
    this.socket = socket;

    this.update();

    const counter = setInterval(() => {
      this.update();
    }, 5000);

    this.setState({
      counter
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.counter);

    this.socket.off();
  }

  render() {
    let uptime = null;
    let maxChannels = null;
    let maxMessages = null;
    let maxSubscription = null;
    let maxMemory = null;
    if (this.state.dashboard) {
      uptime = this.state.dashboard.uptime
        .replace(/m|h/g, ":")
        .replace(/s/g, "");
      maxChannels = this.state.dashboard.store.limits.max_channels
        ? this.state.dashboard.store.limits.max_channels
        : "∞";
      maxMessages = this.state.dashboard.store.limits.max_msgs
        ? this.state.dashboard.store.limits.max_msgs
        : "∞";
      maxSubscription = this.state.dashboard.store.limits.max_subscriptions
        ? this.state.dashboard.store.limits.max_subscriptions
        : "∞";
      maxMemory = this.state.dashboard.store.limits.max_bytes
        ? `${Number(
            this.state.dashboard.store.limits.max_bytes / 1024 / 1024
          ).toFixed(2)} Mb`
        : "∞";
    }

    return (
      this.state.dashboard && (
        <main className="content">
          <Container maxWidth={false} className="container">
            <Grid container spacing={3}  className="grid-fixed-container">
              <Grid item xs={12} md={12} lg={2}>
                <Paper className={clsx("paper", "card-item", "gradient-cyan")}>
                  <Typography variant="h4" component="h2" align="center">
                    {this.state.dashboard.clients}
                  </Typography>
                  <Typography variant="h5" component="h5" align="center" noWrap>
                    Total clients
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={2}>
                <Paper className={clsx("paper", "card-item", "gradient-amber")}>
                  <Typography variant="h4" component="h2" align="center">
                    {this.state.dashboard.channels}
                  </Typography>
                  <Typography variant="h5" component="h5" align="center" noWrap>
                    Total channels
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={2}>
                <Paper
                  className={clsx(
                    "paper",
                    "card-item",
                    "card-item",
                    "gradient-pink"
                  )}
                >
                  <Typography variant="h4" component="h2" align="center">
                    {this.state.dashboard.subscriptions}
                  </Typography>
                  <Typography variant="h5" component="h5" align="center" noWrap>
                    Active subscriptions
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={2}>
                <Paper
                  className={clsx(
                    "paper",
                    "card-item",
                    "card-item",
                    "gradient-teal"
                  )}
                >
                  <Typography variant="h4" component="h2" align="center">
                    {this.state.dashboard.messages}
                  </Typography>
                  <Typography variant="h5" component="h5" align="center" noWrap>
                    Total messages
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={2}>
                <Paper
                  className={clsx(
                    "paper",
                    "card-item",
                    "card-item",
                    "gradient-neuromancer"
                  )}
                >
                  <Typography variant="h4" component="h2" align="center">
                    {Number(this.state.dashboard.size / 1024 / 1024).toFixed(2)}{" "}
                    Mb
                  </Typography>
                  <Typography variant="h5" component="h5" align="center" noWrap>
                    Memory used
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={2}>
                <Paper
                  className={clsx(
                    "paper",
                    "card-item",
                    "card-item",
                    "gradient-sunset"
                  )}
                >
                  <Typography variant="h4" component="h2" align="center">
                    {uptime}
                  </Typography>
                  <Typography variant="h5" component="h5" align="center" noWrap>
                    Uptime
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={3} className="dashboard-statuses">
              <Grid item xs={12} md={12} lg={6}>
                <Paper className={clsx("paper", "dashboard-cards")}>
                  <List subheader={<ListSubheader>Server</ListSubheader>}>
                    <DashboardItem
                      type="ID"
                      content={this.state.dashboard.server_id}
                    />
                    <DashboardItem
                      type="Cluster"
                      content={this.state.dashboard.cluster_id}
                    />
                    <DashboardItem
                      type="Version"
                      content={this.state.dashboard.version}
                    />
                    <DashboardItem
                      type="State"
                      content={this.state.dashboard.state}
                    />
                    <DashboardItem
                      type="Golang version"
                      content={this.state.dashboard.go_version}
                    />
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <Paper className={clsx("paper", "dashboard-cards")}>
                  <List subheader={<ListSubheader>Storage</ListSubheader>}>
                    <DashboardItem
                      type="Type"
                      content={this.state.dashboard.store.type}
                    />
                    <DashboardItem
                      type="Channels limit"
                      content={maxChannels}
                    />
                    <DashboardItem
                      type="Messages limit"
                      content={maxMessages}
                    />
                    <DashboardItem
                      type="Subscriptions limit"
                      content={maxSubscription}
                    />
                    <DashboardItem
                      type="Memory size limit"
                      content={maxMemory}
                    />
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </main>
      )
    );
  }
}

const DashboardRouter = withRouter(Dashboard);

export { DashboardRouter };
