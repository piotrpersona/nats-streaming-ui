import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Header } from "../components/header/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { DashboardRouter } from "../components/content/Dashboard";
import { ChannelsRouter } from "../components/content/Channels";
import { SubscriptionsRouter } from "../components/content/Subscriptions";
import { ClientsRouter } from "../components/content/Clients";
import { MessagesRouter } from "../components/content/Messages";

import { socket } from "../services/ws";

class AppClass extends React.PureComponent {
  state = {
    menuOpen: localStorage.getItem("open") !== "false",
    isOnline: false
  };

  componentDidMount() {
    this.socket = socket;

    const counter = setInterval(() => {
      this.checkStatus();
    }, 5000);

    this.setState({
      counter
    });

    this.checkStatus();
  }

  componentWillUnmount() {
    clearInterval(this.state.counter);

    this.socket.off();
  }

  checkStatus() {
    this.socket.emit("is_online");

    this.socket.on("is_online_result", data => {
      this.setState({
        isOnline: data
      });
    });
  }

  handleDrawerOpen() {
    this.setState({
      menuOpen: true
    });
    localStorage.setItem("open", "true");
  }

  handleDrawerClose() {
    this.setState({
      menuOpen: false
    });
    localStorage.setItem("open", "false");
  }

  render() {
    return (
      <div className="app">
        <Router>
          <CssBaseline />
          <Header
            open={this.state.menuOpen}
            setOpen={this.handleDrawerOpen.bind(this)}
            handleDrawerOpen={this.handleDrawerOpen.bind(this)}
            status={this.state.isOnline}
          />
          <Sidebar
            handleDrawerClose={this.handleDrawerClose.bind(this)}
            open={this.state.menuOpen}
            setOpen={this.handleDrawerOpen.bind(this)}
          />

          <Route path="/" exact component={DashboardRouter} />

          <Route path="/channels/:id" exact component={MessagesRouter} />
          <Route path="/channels" exact component={ChannelsRouter} />
          <Route path="/subscriptions" component={SubscriptionsRouter} />
          <Route path="/clients" component={ClientsRouter} />
        </Router>
      </div>
    );
  }
}

export default AppClass;
