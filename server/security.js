// if application member list search found then return.
Security.defineMethod("isMember", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    const userMemberApplication = Applications.findOne({
      _id: doc._id,
      'members.userId': userId
    });

    // if is undefined return true deny.
    if (_.isUndefined(userMemberApplication)) {
      return true;
    }
  }
});

// INSERT AND REMOVE HAS ROLE ADMIN THEN
Applications.permit(['insert', 'remove']).ifHasRole('admin').apply();

// UPDATE IS MEMBER LIST THEN.
Applications.permit('update').isMember().apply();

// INSERT, UPDATE, REMOVE HAS ADMIN ROLE THEN
Bundles.files.permit(PERMIT_LIST_ALL).ifHasRole('admin').apply();

// INSERT, UPDATE, REMOVE HAS ADMIN ROLE THEN
Logs.permit(PERMIT_LIST_ALL).ifLoggedIn().apply();

// METHODS BEFORE HOOKS
Meteor.beforeMethods(METHODS, function(_id) {

  // CHECKS
  check(_id, String);

  // GET APPLICATION
  const application = Applications.findOne({
    _id,
    'members.userId': this.userId
  });

  // if application undefined then throw error 404.
  if (_.isUndefined(application)) {
    throw new Meteor.Error(404, `${_id} Application isn't found`);
  }
});
