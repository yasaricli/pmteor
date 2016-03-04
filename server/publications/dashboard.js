Meteor.publishComposite('dashboard', function() {
  return {
    find() {

      // ALL APPLICATIONS ERROR LOGS COUNTER
      Counts.publish(this, 'applications-errors', Logs.find({
        type: STATUS_ALLOWED_VALUES[4] // ERRORED STATUS CODE
      }));

      // All applications.
      return Applications.find({ createdBy: this.userId });
    },
    children: [
      {
        find(application) {
          return Logs.find({
            applicationId: application._id
          });
        }
      }
    ]
  }
});
