import React from "react";
import clsx from "clsx";

import { withRouter } from "react-router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

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

    // this.socket.off();
  }

  render() {
    let uptime = null;
    if (this.state.dashboard) {
      uptime = this.state.dashboard.uptime
        .replace(/m|h/g, ":")
        .replace(/s/g, "");
    }

    return (
      this.state.dashboard && (
        <main className="content">
          <Container maxWidth={false} className="container">
            <Grid container spacing={3}>
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
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="ID" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.server_id}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Cluster" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.cluster_id}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Version" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.version}
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="State" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.state}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Golang version" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.go_version}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <Paper className={clsx("paper", "dashboard-cards")}>
                  <List subheader={<ListSubheader>Storage</ListSubheader>}>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Type" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.store.type}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Channels limit" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.store.limits.max_channels}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Messages limit" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.store.limits.max_msgs}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Subscriptions limit" />
                      <ListItemSecondaryAction>
                        {this.state.dashboard.store.limits.max_subscriptions}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary="Memory size limit" />
                      <ListItemSecondaryAction>
                        {Number(
                          this.state.dashboard.store.limits.max_bytes /
                            1024 /
                            1024
                        ).toFixed(2)}{" "}
                        Mb
                      </ListItemSecondaryAction>
                    </ListItem>
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
