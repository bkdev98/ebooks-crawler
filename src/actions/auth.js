import {
  LOGIN_SUCCESS,
  LOGOUT,
} from './types';

export function login() {
  return dispatch => {
    dispatch({ type: LOGIN_SUCCESS });
  };
}

export function logout() {
  return dispatch => {
    dispatch({ type: LOGOUT });
  };
}
