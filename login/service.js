import Locker from '../helpers/locker/service';
import Constants from '../helpers/constants';

/**
 * This service is being used for managing user login.
 * A user credentials are validated from the given API
 * Special case: if the user is 'luke skywalker' he is allowed unlimited search attempts. For all other users, they get 15 attempts per minute.
 * 
 * Database key: 'loggedInUser' is used to store current user information.
 * errors: 
 * 1. Someone is already logged in!
 * 2. Invalid credentials!
 * 3. "user" is not a valid StarWars character!
 */
class LoginService {

  static key = 'loggedInUser';
  static usersApiUrl = 'https://swapi.co/api/people/?search=';
  static maxSearchAllowed = 15;

  getMaxSearchAllowed = user => {
    if (user.username.toLowerCase() == 'luke skywalker') {
      return Constants.UNLIMITED;
    }
    return LoginService.maxSearchAllowed;
  }

  login(user) {
    const loggedInUser = this.getLoggedInUser();

    if (loggedInUser) {
      return new Promise((res, rej) => {
        throw 'Someone is already logged In!';
      });
    } else {
      return fetch(LoginService.usersApiUrl + user.username, { mode: 'cors', credentials: 'same-origin' }).then(res => res.json()).then(res => {
        if (res.results.length == 1) {
          const expectedPassword = res.results[0].birth_year;
          if (user.password === expectedPassword) {
            user['maxSearchAllowed'] = this.getMaxSearchAllowed(user);
            Locker.set(LoginService.key, user);
          } else {
            throw 'Invalid credentials!'
          }
        } else {
          throw user.username + ' is not a StarWars character!';
        }
      });
    }
  }

  logout() {
    return Locker.clear();
  }

  getLoggedInUser() {
    return Locker.get(LoginService.key);
  }

}

export default new LoginService();
