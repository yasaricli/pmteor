import { Roles } from 'meteor/alanning:roles';
import Users from '../users.js';

Users.before.insert((userId, doc) => {

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
