// APPLICATIONS PERMIT
Applications.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();
Bundles.files.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();
Logs.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();

// METHODS BEFORE HOOKS
Meteor.beforeMethods(METHODS, function(_id) {

  // CHECKS
  check(_id, String);

  // GET APPLICATION
  const application = Applications.findOne({
    _id,
    createdBy: this.userId
  });

  // if application undefined then throw error 404.
  if (_.isUndefined(application)) {
    throw new Meteor.Error(404, `${_id} Application isn't found`);
  }
});
