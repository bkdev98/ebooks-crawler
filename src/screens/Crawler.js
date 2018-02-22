import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import CrawlerIcon from 'material-ui-icons/FreeBreakfast';
import { FormControl, FormHelperText } from 'material-ui/Form';

import ProductTable from '../components/ProductTable';

import {
  crawl,
} from '../actions';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 2,
  }),
  formControl: {
    width: '100%',
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 'fit-content',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonIcon: {
    marginLeft: theme.spacing.unit,
  },
  supportedContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    marginLeft: theme.spacing.unit,
  },
});

class Crawler extends Component {
  state = {
    uri: '',
    error: '',
  }

  handleCrawl = () => {
    const { uri } = this.state;
    if (!uri.length || !uri.startsWith('https://nguyenhang.vn/' || !uri.endsWith('.html'))) {
      this.setState({ error: 'Invalid URL. Try again!' });
    } else {
      this.setState({ error: '' });
      this.props.crawl({ uri });
    }
  }

  render() {
    const { classes, categoryLabel, products, loading, uri } = this.props;

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="display1" component="h3">
            Crawl ebooks
          </Typography>
          <Grid container>
            <Grid item xs={12} md={10}>
              <FormControl className={classes.formControl} error={this.state.error.length > 0} aria-describedby="name-error-text">
                <TextField
                  id="url-input"
                  label="Enter URL"
                  placeholder="https://nguyenhang.vn/mcgraw-hill-d128l4.html"
                  className={classes.textField}
                  margin="normal"
                  value={this.state.uri}
                  onChange={event => this.setState({ uri: event.target.value })}
                  disabled={loading}
                />
                <FormHelperText style={{ marginTop: -5, paddingBottom: 5 }} id="name-error-text">{this.state.error}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} className={classes.buttonContainer}>
              <Button
                className={classes.button}
                variant="raised"
                color="primary"
                onClick={this.handleCrawl}
                disabled={loading}
              >
                {!loading ? 'Start Crawler' : 'Crawling...'}
                <CrawlerIcon className={classes.buttonIcon} />
              </Button>
            </Grid>
          </Grid>
          <div className={classes.supportedContainer}>
            <Chip
              avatar={<Avatar>NH</Avatar>}
              label="nguyenhang.vn"
              onClick={() => window.open('https://nguyenhang.vn', '_blank')}
              className={classes.chip}
            />
          </div>
        </Paper>
        {categoryLabel && (
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h3">
              Crawler results for <a href={uri} target="_blank">{categoryLabel}</a>
            </Typography>
            <ProductTable
              products={products}
            />
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(
  connect(state => ({
    uri: state.crawl.uri,
    categoryLabel: state.crawl.categoryLabel,
    products: state.crawl.products,
    loading: state.crawl.loading,
  }), {
    crawl,
  })(Crawler)
);
