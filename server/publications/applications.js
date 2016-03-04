Meteor.publishComposite('applications', function() {
  return {
    find() {

      // ALL APPLICATIONS ERROR LOGS COUNTER
      Counts.publish(this, 'errors-counter', Logs.find({
        type: STATUS_ALLOWED_VALUES[4] // ERRORED STATUS CODE
      }));

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

Meteor.publishComposite('application', function(_id) {
  check(_id, String);

  return {
    find() {
      return Applications.find({ _id, createdBy: this.userId });
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
