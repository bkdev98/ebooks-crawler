import {
  CRAWL_FAILURE,
  CRAWL_REQUEST,
  CRAWL_SUCCESS,
  CRAWL_PRODUCT_FAILURE,
  CRAWL_PRODUCT_REQUEST,
  CRAWL_PRODUCT_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  uri: null,
  categoryLabel: null,
  error: null,
  loading: false,
  products: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CRAWL_REQUEST:
      return {
        ...state,
        categoryLabel: null,
        products: [],
        uri: action.uri,
        loading: true,
        error: null,
      };
    case CRAWL_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryLabel: action.payload.categoryLabel,
        products: action.payload.products,
      };
    case CRAWL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CRAWL_PRODUCT_REQUEST:
      return {
        ...state,
        products: state.products.map(pro => pro.id === action.payload.id
          ? { ...action.payload, status: 'Fetching' }
          : pro
        )
      };
    case CRAWL_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.map(pro => pro.id === action.payload.id
          ? { ...action.payload, status: 'Success' }
          : pro
        )
      };
    case CRAWL_PRODUCT_FAILURE:
      return {
        ...state,
        products: state.products.map(pro => pro.id === action.payload.id
          ? { ...action.payload, status: 'Failure' }
          : pro
        )
      };
    default:
      return state;
  }
};
