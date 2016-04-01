export const Users = Meteor.users;

// USER SEARCH
Users.initEasySearch('username', {
  use: 'mongo-db'
});
