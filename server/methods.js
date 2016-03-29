/*
 * Meteor methods validate secure.
 *
 * Meteor.call('application', { applicationId: String, helper: String })
 *
 * Helper is contains ['start', 'end', 'destroy']
 */
new ValidatedMethod({
  name: 'application',
  validate({ applicationId, helper }) {

    // check to validate arguments
    check(helper, String);
    check(applicationId, String);

    // GET APPLICATION
    const application = Applications.findOne({
      _id: applicationId,
      memberIds: this.userId
    });

    // if application undefined then throw error 404.
    if (_.isUndefined(application)) {
      throw new Meteor.Error(404, `${applicationId} Application isn't found`);
    }

    // NOT CONTAINS METHOD THEN
    if (!_.contains(['start', 'stop'], helper)) {
      throw new Meteor.Error(404, `Application no helper ${helper}`);
    }
  },

  run({ applicationId, helper }) {
    const application = Applications.findOne(applicationId);

    // RUN HELPER
    return application[helper]();
  }
});
