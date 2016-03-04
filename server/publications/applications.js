Meteor.publishComposite('applications', function() {
  return {
    find() {
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
