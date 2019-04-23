import {
  ASYNC_START,
  ASYNC_END,
} from '../constants/actionTypes';

const defaultState = {
  loading: false
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case ASYNC_START:
      return { ...state, loading: true };
    case ASYNC_END:
      return { ...state, loading: false };
    default:
      return state;
  }
};
