import { Meteor } from 'meteor/meteor';

// COLLECTIONS
import { Applications } from '../applications.js';
import { Logs } from '../../logs/logs.js';
import { Users } from '../../users/users.js';

Meteor.publishComposite('applications', function() {
  return {
    find() {
      return Applications.find({ memberIds: this.userId }, {
        sort: {
          createdAt: -1
        }
      });
    },

    children: [

      // ALL LOGS APPLICATION
      {
        find(application) {
          return Logs.find({ applicationId: application._id }, {
            sort: {
              createdAt: -1
            }
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
          }, {
            fields: {
              services: 0
            }
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
      return Applications.find({ _id, memberIds: this.userId });
    },

    children: [

      // ALL LOGS APPLICATION
      {
        find(application) {
          return Logs.find({ applicationId: application._id }, {
            sort: {
              createdAt: -1
            }
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
          }, {
            fields: {
              services: 0
            }
          });
        }
      }
    ]
  }
});
