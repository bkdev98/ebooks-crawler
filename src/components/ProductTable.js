import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DownloadIcon from 'material-ui-icons/CloudDownload';
import CopyIcon from 'material-ui-icons/ContentCopy';
import RecrawlProductIcon from 'material-ui-icons/Refresh';
import { lighten } from 'material-ui/styles/colorManipulator';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { LinearProgress } from 'material-ui/Progress';

import {
  openSnackbar,
  crawlProduct,
  sortProductByStatus,
} from '../actions';

class ProductTableHead extends React.Component {
  state = {
    checked: false,
  }

  handleCheckAll = (event, checked) => {
    this.props.onSelectAllClick(event, checked);
    this.setState({ checked: !this.state.checked });
  }

  render() {
    const { numSelected, order, orderByStatus, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={this.state.checked}
              onChange={this.handleCheckAll}
              color="primary"
            />
          </TableCell>
          <TableCell numeric>
            ID
          </TableCell>
          <TableCell>
            Title
          </TableCell>
          <TableCell
            sortDirection={orderByStatus ? order : false}
          >
            <Tooltip
              title="Sort"
              placement='bottom-start'
              enterDelay={300}
            >
              <TableSortLabel
                active={orderByStatus}
                direction={order}
                onClick={this.props.onRequestSort}
              >
                Status
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

ProductTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
  order: PropTypes.string.isRequired,
  orderByStatus: PropTypes.bool.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.dark,
          backgroundColor: lighten(theme.palette.primary.light, 0.4),
        }
      : {
          color: lighten(theme.palette.primary.light, 0.4),
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let ProductTableToolbar = props => {
  const { numSelected, classes, handleDownload, handleCopy, selectedUrls, handleRecrawlProduct, showRecrawlButton, productsLength } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography variant="subheading">{numSelected}/{productsLength} selected</Typography>
        ) : (
          <Typography variant="title">Products</Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Tooltip title="Copy">
              <CopyToClipboard text={selectedUrls} onCopy={handleCopy}>
                <IconButton aria-label="Copy">
                  <CopyIcon />
                </IconButton>
              </CopyToClipboard>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton aria-label="Download" onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : showRecrawlButton && (
          <Tooltip title="Recrawl Product">
            <IconButton aria-label="Recrawl Product" onClick={handleRecrawlProduct}>
              <RecrawlProductIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

ProductTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

ProductTableToolbar = withStyles(toolbarStyles)(ProductTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  retryButton: {
    cursor: 'pointer',
    color: '#ff4081',
  },
});

class ProductTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderByStatus: false,
      selected: [],
      selectedUrls: '',
      page: 0,
      rowsPerPage: 10,
    };
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.products.filter(n => n.status === 'Success').map(n => n.id) }, () => {
        let urls = '';
        this.state.selected.forEach(id => {
          const product = this.props.products.find(p => p.id === id);
          if (product) {
            const url = 'https://drive.google.com/uc?export=download&id=' + product.googleDriveUri.split('id=')[1];
            urls = urls + '\n' + url;
          }
        });
        this.setState({ selectedUrls: urls });
      });
      return;
    } else {
      this.setState({ selected: [] });
    }
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected }, () => {
      let urls = '';
      this.state.selected.forEach(id => {
        const product = this.props.products.find(p => p.id === id);
        if (product) {
          const url = 'https://drive.google.com/uc?export=download&id=' + product.googleDriveUri.split('id=')[1];
          urls = urls + '\n' + url;
        }
      });
      this.setState({ selectedUrls: urls });
    });
  };

  handleSortByStatus = event => {
    const orderByStatus = true;
    let order = 'desc';

    if (orderByStatus && this.state.order === 'desc') {
      order = 'asc';
    }

    this.props.sortProductByStatus(order);

    this.setState({ orderByStatus, order });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDownload = () => {
    this.state.selected.forEach(id => {
      const product = this.props.products.find(p => p.id === id);
      if (product) {
        const url = 'https://drive.google.com/uc?export=download&id=' + product.googleDriveUri.split('id=')[1];
        window.open(url, "_blank");
      }
    });
  };

  handleCopy = () => {
    this.props.openSnackbar({ message: 'URIs copied!' });
  }

  handleRecrawl = () => {
    this.props.products.forEach(product => {
      if (product.status !== 'Success') {
        this.props.crawlProduct(product);
      }
    });
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, products, productCrawled } = this.props;
    const { selected, rowsPerPage, page, selectedUrls, orderByStatus, order } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);

    return (
      <div className={classes.root}>
        <ProductTableToolbar
          selectedUrls={selectedUrls}
          handleCopy={this.handleCopy}
          handleDownload={this.handleDownload}
          numSelected={selected.length}
          showRecrawlButton={products.findIndex(p => p.status !== 'Success') !== -1}
          handleRecrawlProduct={this.handleRecrawl}
          productsLength={products.length}
        />
        {productCrawled < products.length && <LinearProgress variant="determinate" value={productCrawled / products.length * 100} />}
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <ProductTableHead
              numSelected={selected.length}
              onSelectAllClick={this.handleSelectAllClick}
              rowCount={products.length}
              orderByStatus={orderByStatus}
              order={order}
              onRequestSort={this.handleSortByStatus}
            />
            <TableBody>
              {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onClick={n.googleDriveUri ? event => this.handleClick(event, n.id) : () => {}}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} color="primary" disabled={!n.googleDriveUri} />
                    </TableCell>
                    <TableCell numeric>{n.id}</TableCell>
                    <TableCell>
                      <a href={`https://nguyenhang.vn/${n.uri}`} target="_blank">{n.title}</a>
                    </TableCell>
                    <TableCell>
                      {n.status !== 'Failure'
                        ? <p style={{ color: n.status === 'Success' ? '#3f51b5' : '#000' }}>{n.status}</p>
                        : <a className={classes.retryButton} onClick={() => this.props.crawlProduct(n)}>{n.status}</a>
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={products.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    );
  }
}

ProductTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(state => ({
  productCrawled: state.crawl.productCrawled,
}), {
  openSnackbar,
  crawlProduct,
  sortProductByStatus,
})(ProductTable));
