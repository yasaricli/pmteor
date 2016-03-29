Meteor.publishComposite('applications', function() {
  return {
    find() {
      return Applications.find({ memberIds: this.userId }, {
        ...SORT_FILTERS
      });
    },

    children: [

      // ALL LOGS APPLICATION
      {
        find(application) {
          return Logs.find({ applicationId: application._id }, {
            ...SORT_FILTERS
          });
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
          return Logs.find({ applicationId: application._id }, {
            ...SORT_FILTERS
          });
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
