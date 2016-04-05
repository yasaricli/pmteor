import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

// USER SEARCH
Meteor.users.initEasySearch('username', {
  use: 'mongo-db'
});

Meteor.users.helpers({
  email() {
    return _.first(this.emails).address;
  }
});

export default Meteor.users;
