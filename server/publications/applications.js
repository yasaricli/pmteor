Meteor.publishComposite('applications', function() {
  return {
    find() {

      // ALL APPLICATIONS ERROR LOGS COUNTER
      Counts.publish(this, 'errors-counter', Logs.find({
        type: STATUS_ALLOWED_VALUES[4] // ERRORED STATUS CODE
      }));

      return Applications.find({ memberIds: this.userId });
    },

    children: [

      // ALL LOGS APPLICATION
      {
        find(application) {
          return Logs.find({ applicationId: application._id });
        }
      },

      // MEMBERS APPLICATION
      {
        find(application) {
          return Users.find({
            _id: {
              $in: application.memberIds
            }
          }, { ...USERS_FIELDS });
        }
      }
    ]
  }
});

Meteor.publishComposite('application', function(_id) {
  check(_id, String);

  return {
    find() {
      return Applications.find({ _id, memberIds: this.userId });
    },

    children: [

      // ALL LOGS APPLICATION
      {
        find(application) {
          return Logs.find({ applicationId: application._id });
        }
      },

      // MEMBERS APPLICATION
      {
        find(application) {
          return Users.find({
            _id: {
              $in: application.memberIds
            }
          }, { ...USERS_FIELDS });
        }
      }
    ]
  }
});
