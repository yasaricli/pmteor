Users = Meteor.users;

// USER SEARCH
Users.initEasySearch('username', {
  use: 'mongo-db'
});

Users.helpers({
  email() {
    return _.first(this.emails).address;
  }
});

Dev.isServer(() => {
  Users.before.insert((userId, doc) => {
    const users = Users.find();

    doc.profile = {
      language: 'en' // DEFAULT LANGUAGE EN
    };
  });

  Users.after.insert((userId, doc) => {
    const users = Users.find();

    // The first register that users must have admin.
    if (_.isEqual(users.count(), 1)) {

      // ADD ROLE
      Roles.addUsersToRoles(doc._id, 'admin');
    }
  });
});
