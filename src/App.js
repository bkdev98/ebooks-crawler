import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import { CircularProgress } from 'material-ui/Progress';

import store from './store';

import Screens from './screens';
import AppDrawer from './components/AppDrawer';
import AppNavBar from './components/AppNavBar';
import AppSnackBar from './components/AppSnackBar';
import Footer from './components/Footer';

class App extends Component {
  state = {
    showDrawer: false,
  }

  handleDrawerOpen = () => {
    this.setState({ showDrawer: true });
  };

  handleDrawerClose = () => {
    this.setState({ showDrawer: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <Provider store={store}>
        <PersistGate loading={<CircularProgress />} persistor={persistStore(store)}>
          <Router>
            <div className={classes.root}>
              <div className={classes.appFrame}>
                <AppSnackBar />
                <AppNavBar
                  isOpen={this.state.showDrawer}
                  handleDrawerOpen={this.handleDrawerOpen}
                />
                <AppDrawer
                  isOpen={this.state.showDrawer}
                  handleDrawerClose={this.handleDrawerClose}
                />
                <main className={classes.content}>
                  <Route exact path="/" component={Screens.Home} />
                  <Route path="/crawler" component={Screens.Crawler} />
                  <Route path="/about" component={Screens.About} />
                  <Footer />
                </main>
              </div>
            </div>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    '-webkit-flex': '1 1 auto',
    overflowY: 'auto',
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    display: 'flex',
    '-webkit-flex': '1 1 auto',
    overflowY: 'auto',
    height: '100vh',
    position: 'relative',
    width: '100%',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

export default withStyles(styles, { withTheme: true })(App);
