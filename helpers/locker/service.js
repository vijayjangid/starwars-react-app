import Lockr from 'lockr';
import config from './config';
/**
 * Wrapper on lockr module to save, retreive and clear data from LocalStorage
 * This is being used for saving the logged in user details and works as a mock database.
 */
class Locker {
  constructor() {
    Lockr.prefix = config.prefix;
  }

  get(key) {
    return Lockr.get(key);
  }

  set(key, value) {
    return Lockr.set(key, value);
  }

  clear() {
    return Lockr.flush();
  }
}

const locker = new Locker();
export default locker;