import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import HomeIcon from 'material-ui-icons/Home';
import CrawlerIcon from 'material-ui-icons/DeveloperBoard';
import AboutIcon from 'material-ui-icons/InfoOutline';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    display: 'flex',
    flex: 1,
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerItem: {
    textDecoration: 'none',
  },
  activeItem: {
    backgroundColor: '#3f51b5',
  },
});

const AppDrawer = ({ classes, theme, isOpen, handleDrawerClose }) => (
  <Drawer
    variant="permanent"
    classes={{
      paper: classNames(classes.drawerPaper, !isOpen && classes.drawerPaperClose),
    }}
    open={isOpen}
  >
    <div className={classes.drawerInner}>
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => handleDrawerClose()}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <NavLink to="/" className={classes.drawerItem}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </NavLink>
        <NavLink to="/crawler" className={classes.drawerItem}>
          <ListItem button>
            <ListItemIcon>
              <CrawlerIcon />
            </ListItemIcon>
            <ListItemText primary="Crawler" />
          </ListItem>
        </NavLink>
      </List>
      <Divider />
      <List>
        <NavLink to="/about" className={classes.drawerItem}>
          <ListItem button>
            <ListItemIcon>
              <AboutIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
        </NavLink>
      </List>
    </div>
  </Drawer>
);

AppDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AppDrawer);
