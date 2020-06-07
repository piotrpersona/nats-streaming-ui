import React from "react";
import { withRouter } from "react-router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Refresh from "@material-ui/icons/Refresh";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";

import shortid from "shortid";

import { socket } from "../../services/ws";

class Subscriptions extends React.Component {
  state = { subscriptions: [], socket: null };

  makeButton(status) {
    if (status) return <CheckRoundedIcon className="checkGreen" />;

    return <ClearRoundedIcon className="clearRed" />;
  }

  update() {
    this.socket.emit("get_subscriptions");
    this.socket.on("subscriptions_received", subscriptions => {
      this.setState({
        subscriptions: subscriptions.subscriptions
      });
    });
  }

  componentDidMount() {
    this.socket = socket;
    this.update();
  }

  componentWillUnmount() {
    this.socket.off();
  }

  render() {
    return (
      <main className="content">
        <Container maxWidth={false} className="container">
          <Grid container spacing={3} className="grid-fixed-container">
            <Grid item xs={6} md={6} lg={1}>
              <Typography
                variant="h5"
                component="h1"
                align="left"
                className="title-container"
              >
                Subscriptions
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} lg={11} className="buttons-container">
              <Fab
                className="refresh-button-subs"
                onClick={() => this.update()}
              >
                <Refresh />
              </Fab>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6} md={6} lg={12}>
              <Paper className="table-content">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client name</TableCell>
                      <TableCell>Channel</TableCell>
                      <TableCell>Inbox</TableCell>
                      <TableCell>Online</TableCell>
                      <TableCell>Durable</TableCell>
                      <TableCell>Stalled</TableCell>
                      <TableCell>Ask wait, sec</TableCell>
                      <TableCell>Max inflight</TableCell>
                      <TableCell>Pending</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.subscriptions.map(row => (
                      <TableRow key={shortid.generate()}>
                        <TableCell component="th" scope="row">
                          {row.client_id}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.channel_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.inbox}
                        </TableCell>

                        <TableCell component="th" scope="row">
                          {this.makeButton(!row.is_offline)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {this.makeButton(row.is_durable)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {this.makeButton(row.is_stalled)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.ack_wait}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.max_inflight}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.pending_count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    );
  }
}

const SubscriptionsRouter = withRouter(Subscriptions);

export { SubscriptionsRouter };
