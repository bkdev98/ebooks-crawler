import React from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

const About = ({ classes }) => (
  <Paper className={classes.root} elevation={1}>
    <Typography variant="display1">About Ebook Crawler</Typography>
  </Paper>
);

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 2,
  }),
});

export default withStyles(styles)(About);
