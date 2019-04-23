import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

import { Router, Route, browserHistory } from 'react-router';

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import store from './store';

import App from './app/component';
import Login from './login/component';
import Search from './search/component';

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props;
    return (
      <Route
        {...props}
        render={props => (
          this.props.login.currentUser ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )}
      />
    )
  }
}

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/login" component={Login} />
        <ProtectedRoute path='/search' component={Search} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('universe'));
