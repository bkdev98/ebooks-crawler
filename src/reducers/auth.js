import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../actions/types';

const INITIAL_STATE = {
  loggedIn: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    case LOGOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
