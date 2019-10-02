import React from "react";
import {
  string as PropTypesString,
  number as PropTypesNumber,
  oneOfType
} from "prop-types";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItem from "@material-ui/core/ListItem";

class DashboardItem extends React.Component {
  static propTypes = {
    type: oneOfType([PropTypesString.isRequired, PropTypesNumber.isRequired]),
    content: oneOfType([PropTypesString.isRequired, PropTypesNumber.isRequired])
  };

  render() {
    return (
      <ListItem>
        <ListItemIcon>
          <ArrowRightIcon />
        </ListItemIcon>
        <ListItemText primary={this.props.type} />
        <ListItemSecondaryAction>{this.props.content}</ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export { DashboardItem };
