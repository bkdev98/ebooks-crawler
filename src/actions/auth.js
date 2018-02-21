import { firebaseAuth, googleProvider } from '../database';

import {
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
} from './types';
import { openSnackbar } from './snackbar';

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = payload => ({ type: LOGIN_SUCCESS, payload });
const loginFailure = error => ({ type: LOGIN_FAILURE, error });

export function login() {
  return async dispatch => {
    dispatch(loginRequest());
    try {
      const result = await firebaseAuth().signInWithPopup(googleProvider);
      dispatch(loginSuccess(result));
      dispatch(openSnackbar({ message: `Hello, ${result.user.displayName}` }));
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };
}

export function logout() {
  firebaseAuth().signOut();
  return dispatch => {
    dispatch({ type: LOGOUT });
    dispatch(openSnackbar({ message: 'Signout success!' }));
  };
}
