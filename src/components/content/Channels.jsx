import React from "react";
import { withRouter } from "react-router";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import AddIcon from "@material-ui/icons/Add";
import Refresh from "@material-ui/icons/Refresh";

import shortid from "shortid";

import { socket } from "../../services/ws";

class Channels extends React.Component {
  state = {
    channels: [],
    openDialogChannel: false,
    channelName: "",
    socket: null,
    openDialogMessage: false,
    channelNameMessage: "",
    message: ""
  };

  update() {
    this.socket.emit("get_channels");
    this.socket.on("channels_received", data => {
      if (data.channels) {
        const channels = data.channels.map(chn => {
          return {
            name: chn.name,
            messages: chn.msgs,
            messages_size: `${Number(chn.bytes / 1024 / 1024).toFixed(2)} Mb`,
            subscriptions: Array.isArray(chn.subscriptions)
              ? chn.subscriptions.length
              : 0,
            last_sequential: chn.last_seq
          };
        });
        this.setState({
          channels
        });
      }
    });
  }

  componentDidMount() {
    this.socket = socket;

    this.update();
  }

  componentWillUnmount() {
    this.socket.off();
  }

  channelNameMessagesHandler(event) {
    this.setState({
      channelNameMessage: event.target.value
    });
  }

  dialogHandler() {
    this.setState({
      openDialogChannel: !this.state.openDialogChannel,
      channelName: ""
    });
  }

  messagesDialogHandler() {
    this.setState({
      openDialogMessage: !this.state.openDialogMessage,
      channelNameMessage: ""
    });
  }

  channelNameHandler(event) {
    this.setState({
      channelName: event.target.value
    });
  }

  messagesTextHandler(event) {
    this.setState({
      message: event.target.value
    });
  }

  createChannel() {
    this.socket.emit("create_channel", { channelName: this.state.channelName });
    this.socket.on("channel_created", message => {
      this.setState({
        openDialogChannel: false
      });
      this.update();
    });
  }

  sendMessage() {
    this.socket.emit("send_message", {
      channelName: this.state.channelNameMessage,
      message: this.state.message
    });
    this.socket.on("message_sent", message => {
      this.setState({
        openDialogMessage: false
      });
      this.update();
    });
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
                Channels
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} lg={11} className="buttons-container">
              <Fab className="refresh-button" onClick={() => this.update()}>
                <Refresh />
              </Fab>
              <Fab className="add-button" onClick={() => this.dialogHandler()}>
                <AddIcon />
              </Fab>
              <Fab
                className="message-button"
                onClick={() => this.messagesDialogHandler()}
              >
                <MailOutlineIcon />
              </Fab>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6} md={6} lg={12}>
              <Paper className="table-content">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Channel name</TableCell>
                      <TableCell align="right">Subscriptions</TableCell>
                      <TableCell align="right">Messages</TableCell>
                      <TableCell align="right">Total messages size</TableCell>
                      <TableCell align="right">Last sequential</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.channels.map(row => (
                      <TableRow
                        key={row.name}
                        className="channels-row"
                        onClick={() => {
                          this.props.history.push(`/channels/${row.name}`);
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.subscriptions}</TableCell>
                        <TableCell align="right">{row.messages}</TableCell>
                        <TableCell align="right">{row.messages_size}</TableCell>
                        <TableCell align="right">
                          {row.last_sequential}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Dialog
          open={this.state.openDialogMessage}
          onClose={() => {
            this.messagesDialogHandler();
          }}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Send message</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sending message to the selected channel
            </DialogContentText>
            <FormControl fullWidth>
              <InputLabel htmlFor="channel-name-open-select">
                Channel name
              </InputLabel>
              <Select
                onChange={event => this.channelNameMessagesHandler(event)}
                value={this.state.channelNameMessage}
                inputProps={{
                  name: "channel-name",
                  id: "channel-name-open-select"
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {this.state.channels.map(channel => {
                  return (
                    <MenuItem value={channel.name} key={shortid.generate()}>
                      {channel.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="message"
              label="Message"
              type="text"
              fullWidth
              multiline
              onChange={event => this.messagesTextHandler(event)}
              value={this.state.message}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.messagesDialogHandler();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.sendMessage();
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.openDialogChannel}
          onClose={() => {
            this.dialogHandler();
          }}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">Add channel</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Creating new channel in Nats Streaming
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Channel name"
              type="text"
              fullWidth
              onChange={event => this.channelNameHandler(event)}
              value={this.state.channelName}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.dialogHandler();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.createChannel();
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    );
  }
}
const ChannelsRouter = withRouter(Channels);

export { ChannelsRouter };
