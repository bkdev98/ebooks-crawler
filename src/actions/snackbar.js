import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
} from './types';

export const openSnackbar = payload => ({ type: OPEN_SNACKBAR, payload });
export const closeSnackbar = () => ({ type: CLOSE_SNACKBAR });
