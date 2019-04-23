import { combineReducers } from 'redux';
import login from './reducers/login';
import common from './reducers/common';

export default combineReducers({
  common, login
});
