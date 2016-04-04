import { Meteor } from 'meteor/meteor';

// USER SEARCH
Meteor.users.initEasySearch('username', {
  use: 'mongo-db'
});

export default Meteor.users;
