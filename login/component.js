import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginService from './service';
import './style.scss';

import { UsernameIcon, PasswordIcon } from '../helpers/components/icons';

import { LOGIN, LOGOUT, REDIRECT, ASYNC_START, ASYNC_END } from '../constants/actionTypes';

/**
 * Login component (first screen) allows a valid StarWars user to enter into application.
 * (below information is added for this excercise purpose, in real application,
 * we are not supposed to give such hints for username/password)
 * Username: should be a valid StarWars user (e.g. luke skywalker, han solo)
 * Password: should be a valid password (for this demo, we are using birth year e.g. 19BBY, 29BBY respectively)
 * errors: 1. "username" is not a valid starwars character
 *         2. Invalid credentials
 */
const mapDispatchToProps = dispatch => ({
  onLoadingStart: () => dispatch({ type: ASYNC_START }),
  onLoadingEnd: () => dispatch({ type: ASYNC_END }),
  onLogin: (error, user) =>
    dispatch({ type: LOGIN, payload: { user }, error }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: null
    }
  }

  login = () => {

    if (this.validateForm()) {
      const { username, password } = this.state;
      const { onLoadingStart, onLoadingEnd } = this.props;
      const user = {
        username,
        password
      }

      // let's try to login
      onLoadingStart();
      LoginService.login(user).then(() => {
        // login successfull!
        this.setState({ error: null });
        this.props.onLogin(null, user);
        this.context.router.replace('/search');
        onLoadingEnd();
      }).catch(error => {
        // errors while login
        this.setState({ error });
        onLoadingEnd();
        this.props.onLogin(error, user);
        this.props.onLoadingEnd();
      });
    }
  }

  handleChange = ({ target: { name: propertyName, value: propertyValue } }) => {
    switch (propertyName) {
      case 'username': this.setState({ username: propertyValue });
        break;
      case 'password': this.setState({ password: propertyValue });
        break;
      default: break;
    }
  }

  validateForm = () => {
    const { username, password } = this.state;

    // don't enable login untill username & password are filled
    return username.length > 0 && password.length > 0;
  }

  render() {
    const { username, password, error } = this.state;

    // add active class to username/password icon when user types in
    const usernameIconActiveClass = classNames('username-icon', {
      'active': username.length
    });
    const passwordIconActiveClass = classNames('password-icon', {
      'active': password.length
    });

    return (
      <div className="login">
        <div className="username">
          <div className={usernameIconActiveClass}>
            <UsernameIcon />
          </div>
          <input type="text" placeholder="Enter StarWars character name" className="input-username" name="username" value={username} onChange={this.handleChange} />
        </div>
        <div className="password">
          <div className={passwordIconActiveClass}>
            <PasswordIcon />
          </div>
          <input type="password" placeholder="Enter password" className="input-password" name="password" value={password} onChange={this.handleChange} />
        </div>
        <button className="button-submit" onClick={this.login} disabled={!this.validateForm()}>Log in to "Universe"</button>
        {error && (
          <p className="error">{error}</p>
        )
        }
      </div >
    );
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
};
export default connect(null, mapDispatchToProps)(Login);
