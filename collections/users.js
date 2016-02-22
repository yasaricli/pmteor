Users = Meteor.users;

Users.helpers({
  gravatar(size=34, def='mm') {
    const email = _.first(this.emails);
    return Gravatar.imageUrl(email.address, {
      size,
      default: def,
    });
  }
});
