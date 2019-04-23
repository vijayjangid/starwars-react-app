import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import reducers from './reducers';

const getMiddleware = () => {
  return applyMiddleware(createLogger())
}

const store = createStore(reducers, composeWithDevTools(getMiddleware()))

export default store;
