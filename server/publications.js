Meteor.publishComposite('applications', function(_id) {
  return {
    find() {

      // Detail application
      if (_id) {
        return Applications.find({ _id });
      }

      // All applications.
      return Applications.find();
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

Meteor.publishComposite('dashboard', function() {
  return {
    find() {

      // ALL APPLICATIONS ERROR LOGS COUNTER
      Counts.publish(this, 'applications-errors', Logs.find({
        type: STATUS_ALLOWED_VALUES[4] // ERRORED STATUS CODE
      }));

      // All applications.
      return Applications.find();
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
