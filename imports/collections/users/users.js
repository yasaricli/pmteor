import { _ } from 'meteor/underscore';

export const Users = Meteor.users;

// USER SEARCH
Users.initEasySearch('username', {
  use: 'mongo-db'
});

Users.helpers({
  email() {
    return _.first(this.emails).address;
  }
});
