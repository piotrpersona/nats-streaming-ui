import React from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";

import { useStyles } from "../../cssinjs";

const Header = props => {
  const { open, handleDrawerOpen, status } = props;
  const classes = useStyles();
  return (
    <AppBar
      position="absolute"
      className={clsx(
        classes.appBar,
        open && classes.appBarShift,
        "colored-navbar"
      )}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
        >
          NATS Console
        </Typography>
        <Avatar className={status ? "isOnline" : "isOffline"}>
          {status ? "ON" : "OFF"}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
};

export { Header };
