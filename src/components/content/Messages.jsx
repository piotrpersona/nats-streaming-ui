import React from "react";
import { withRouter } from "react-router";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Refresh from "@material-ui/icons/Refresh";
import Fab from "@material-ui/core/Fab";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";

import shortid from "shortid";

import { socket } from "../../services/ws";

class Messages extends React.Component {
  state = { messages: [], socket: null, channelId: null };
  componentDidMount() {
    this.socket = socket;

    this.setState(
      {
        channelId: this.props.match.params.id
      },
      () => {
        this.update();
      }
    );
  }

  update() {
    this.socket.emit("get_messages", { channelName: this.state.channelId });
    this.socket.on("messages_received", messages => {
      if (Array.isArray(messages)){
        messages.sort((a, b) => b.sequence - a.sequence);
      }
      this.setState({
        messages: messages
      });
    });
  }

  componentWillUnmount() {
    this.socket.off();
  }

  makeButton(status) {
    if (status) return <CheckRoundedIcon className="checkGreen" />;

    return <ClearRoundedIcon className="clearRed" />;
  }

  render() {
    return (
      <main className="content">
        <Container maxWidth={false} className="container">
          <Grid container spacing={3}  className="grid-fixed-container">
            <Grid item xs={6} md={6} lg={1}>
              <Typography
                variant="h5"
                component="h1"
                align="left"
                className="title-container"
              >
                Messages
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} lg={11} className="buttons-container">
              <Fab className="refresh-button" onClick={() => this.update()}>
                <Refresh />
              </Fab>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6} md={6} lg={12}>
              <Paper className="table-content paper-table">
                <Table stickyHeader={true}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sequence</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Redelivered</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.messages.map(row => (
                      <TableRow
                        key={shortid.generate()}
                        className="channels-row"
                      >
                        <TableCell component="th" scope="row">
                          {row.sequence}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.data}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {this.makeButton(row.isRedelivered)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.timestamp}
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

const MessagesRouter = withRouter(Messages);

export { MessagesRouter };
