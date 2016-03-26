Users = Meteor.users;

Users.initEasySearch('username', {
  use: 'mongo-db'
});

Users.helpers({
  email() {
    return _.first(this.emails).address;
  }
});
