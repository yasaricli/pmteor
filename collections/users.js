Users = Meteor.users;

Users.helpers({
  email() {
    return _.first(this.emails).address;
  }
});
