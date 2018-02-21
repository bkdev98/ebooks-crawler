import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
} from '../actions/types';

const INITIAL_STATE = {
  showSnackbar: false,
  message: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_SNACKBAR:
      return {
        ...state,
        showSnackbar: true,
        message: action.payload.message,
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        showSnackbar: false,
      };
    default:
      return state;
  }
};
