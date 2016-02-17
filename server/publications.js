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
