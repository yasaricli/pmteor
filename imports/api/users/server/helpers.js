import { _ } from 'meteor/underscore';
import Users from '../users.js';

Users.helpers({
  email() {
    return _.first(this.emails).address;
  }
});
