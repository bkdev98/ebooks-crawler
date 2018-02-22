import {
  CRAWL_FAILURE,
  CRAWL_REQUEST,
  CRAWL_SUCCESS,
  CRAWL_PRODUCT_FAILURE,
  CRAWL_PRODUCT_REQUEST,
  CRAWL_PRODUCT_SUCCESS,
  SORT_PRODUCT_BY_STATUS,
} from './types';
import { crawlCategory, crawlProductDownload } from '../crawlers';
import { openSnackbar } from './snackbar';

const crawlRequest = uri => ({ type: CRAWL_REQUEST, uri });
const crawlSuccess = payload => ({ type: CRAWL_SUCCESS, payload });
const crawlFailure = error => ({ type: CRAWL_FAILURE, error });

export function crawl(payload) {
  return async dispatch => {
    dispatch(crawlRequest(payload.uri));
    try {
      const result = await crawlCategory(payload.uri);
      dispatch(crawlSuccess(result));
      dispatch(openSnackbar({ message: 'Crawl success!' }));
      result.products.map(product => dispatch(crawlProduct(product)));
    } catch (error) {
      dispatch(crawlFailure(error));
      dispatch(openSnackbar({ message: error.message }));
    }
  };
}

const crawlProductRequest = payload => ({ type: CRAWL_PRODUCT_REQUEST, payload });
const crawlProductSuccess = payload => ({ type: CRAWL_PRODUCT_SUCCESS, payload });
const crawlProductFailure = payload => ({ type: CRAWL_PRODUCT_FAILURE, payload });

export function crawlProduct(payload) {
  return async dispatch => {
    dispatch(crawlProductRequest(payload));
    try {
      const result = await crawlProductDownload(payload);
      dispatch(crawlProductSuccess(result));
    } catch (error) {
      dispatch(crawlProductFailure(payload));
      dispatch(openSnackbar({ message: error.message }));
    }
  };
}

export const sortProductByStatus = order => ({ type: SORT_PRODUCT_BY_STATUS, order });
