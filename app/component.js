import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LOGIN, LOGOUT } from '../constants/actionTypes';
import loginService from '../login/service';
import Loader from '../loader/component';
import '../styles/base.scss';


const mapStateToProps = state => ({
  loggedInUser: state.login.currentUser,
  isLoading: state.common.loading,
});

const mapDispatchToProps = dispatch => ({
  onLogin: (error, user) =>
    dispatch({ type: LOGIN, payload: { user }, error }),
  onLogout: () =>
    dispatch({ type: LOGOUT }),
});

class App extends Component {
  componentWillMount() {
    this.refresh();

  }
  onLogout = () => {
    loginService.logout();
    this.props.onLogout();
    this.refresh();

  }
  refresh = () => {
    this.setState({ error: null });
    const loggedInUser = loginService.getLoggedInUser();
    if (loggedInUser) {
      this.props.onLogin(null, loggedInUser);
      this.context.router.replace('/search');
    } else {
      this.context.router.replace('/login');
    }
  }

  render() {
    const { isLoading, loggedInUser } = this.props;
    return (
      <div>
        {isLoading && (<Loader isLoading={isLoading} />)}
        <div className="container">
          <header className="header">
            {loggedInUser && (
              <div className="logout">
                <div className="welcome-user">Welcome, {loggedInUser.username.toUpperCase()}
                  <p>
                    (You can perform {loggedInUser.maxSearchAllowed} search per minute)
                  </p>
                </div>
                <button className="button-logout" onClick={this.onLogout}>Logout from this universe</button>
              </div>
            )}
            <div className="logo"></div>
          </header>
          <div className="content">
            {this.props.children}
          </div>
        </div>
        <div className="background">
          <div className="small-stars"></div>
          <div className="medium-stars"></div>
          <div className="large-stars"></div>
        </div>
      </div>
    );
  }

}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
