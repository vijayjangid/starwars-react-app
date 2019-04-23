import {
  LOGOUT,
  LOGIN,
} from '../constants/actionTypes';


export default (state = {}, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...state, currentUser: null };
    case LOGIN:
      return {
        ...state,
        currentUser: action.error ? null : action.payload.user
      };
    default:
      return state;
  }
};
