// INSERT AND REMOVE HAS ROLE ADMIN THEN
Applications.permit(['insert', 'remove']).ifHasRole('admin').apply();

// UPDATE IS MEMBER LIST THEN.
Applications.permit('update').ifMemberAdmin().apply();

// INSERT, UPDATE, REMOVE HAS ADMIN ROLE THEN
Bundles.files.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();

// INSERT, UPDATE, REMOVE HAS ADMIN ROLE THEN
Logs.permit(PERMIT_LIST_ALL).ifLoggedIn().apply();

// METHODS BEFORE HOOKS
Meteor.beforeMethods(METHODS, function(_id) {

  // CHECKS
  check(_id, String);

  // GET APPLICATION
  const application = Applications.findOne({ _id, memberIds: this.userId });

  // if application undefined then throw error 404.
  if (_.isUndefined(application)) {
    throw new Meteor.Error(404, `${_id} Application isn't found`);
  }
});
