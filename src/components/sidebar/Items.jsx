import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Tooltip from "@material-ui/core/Tooltip";

import Equalizer from "@material-ui/icons/Equalizer";
import Toc from "@material-ui/icons/Toc";
import Chat from "@material-ui/icons/Chat";
import SyncAlt from "@material-ui/icons/SyncAlt";

import { Link } from "react-router-dom";

const ListItems = (
  <div>
    <Link to="/">
      <ListItem button>
        <Tooltip title="Dashboard">
          <ListItemIcon>
            <Equalizer />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Link to="/channels">
      <ListItem button>
        <Tooltip title="Channels">
          <ListItemIcon>
            <Toc />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Channels" />
      </ListItem>
    </Link>
    <Link to="/subscriptions">
      <ListItem button>
        <Tooltip title="Subscriptions">
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Subscriptions" />
      </ListItem>
    </Link>
    <Link to="/clients">
      <ListItem button>
        <Tooltip title="Clients">
          <ListItemIcon>
            <SyncAlt />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Clients" />
      </ListItem>
    </Link>
  </div>
);

export { ListItems };
