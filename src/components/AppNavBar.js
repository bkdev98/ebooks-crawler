import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Button from 'material-ui/Button';

import {
  login,
  logout,
} from '../actions';

const drawerWidth = 240;

class AppNavBar extends Component {
  state = {
    anchorEl: null,
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.setState({ anchorEl: null });
    this.props.logout();
  }

  render() {
    const { classes, isOpen, handleDrawerOpen, auth, appName } = this.props;
    const open = Boolean(this.state.anchorEl);

    return (
      <AppBar className={classNames(classes.appBar, isOpen && classes.appBarShift)}>
        <Toolbar disableGutters={!isOpen}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => handleDrawerOpen()}
            className={classNames(classes.menuButton, isOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.flex} variant="title" color="inherit" noWrap>
            {appName}
          </Typography>
          {auth.loggedIn ? (
            <div>
              <Button className={classes.button} size="small" onClick={this.handleMenu}>
                <AccountCircle className={classes.leftIcon} />
                {auth.user.displayName}
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button className={classes.button} onClick={this.props.login}>
              Login with Google
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = theme => ({
  appBar: {
    flexGrow: 1,
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  flex: {
    flex: 1,
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  button: {
    margin: theme.spacing.unit,
    color: '#FFFFFF',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles, { withTheme: true })(connect(state => ({
  appName: state.app.appName,
  auth: state.auth,
}), {
  login,
  logout,
})(AppNavBar));
