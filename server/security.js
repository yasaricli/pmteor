// INSERT AND REMOVE HAS ROLE ADMIN THEN
Applications.permit(['insert', 'remove']).ifHasRole('admin').apply();

// UPDATE IS MEMBER LIST THEN.
Applications.permit('update').ifMemberAdmin().apply();

Logs.permit(PERMIT_LIST_ALL).ifLoggedIn().apply();

// COLLECTIONFS BUNDLES PERMIT.
Security.permit(PERMIT_LIST_ALL).collections([Bundles]).ifHasRole('admin').apply();
Security.permit(['download']).collections([Bundles]).never().apply();

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
