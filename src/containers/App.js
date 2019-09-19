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

function App() {
  const isOpened = localStorage.getItem("open") !== "false";
  const [open, setOpen] = React.useState(isOpened);

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("open", "true");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("open", "false");
  };

  return (
    <div className="app">
      <Router>
        <CssBaseline />
        <Header
          open={open}
          setOpen={setOpen}
          handleDrawerOpen={handleDrawerOpen}
        />
        <Sidebar
          handleDrawerClose={handleDrawerClose}
          open={open}
          setOpen={setOpen}
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

export default App;
