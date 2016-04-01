import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Dev } from 'meteor/pmteor:dev';

import { Logs } from '../logs/logs.js';
import { Users } from '../users/users.js';
import { Bundles } from '../bundles/bundles.js';

import { STATUS_ALLOWED_VALUES, STATUS_MAPPER } from './utils.js';

export const Applications = new Mongo.Collection('applications');

// Attach behaviour with the default options
Applications.attachBehaviour('timestampable');

// SCHEMA
Applications.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true,
    label: 'Application Name'
  },

  status: {
    type: String,
    allowedValues: STATUS_ALLOWED_VALUES,
    defaultValue: STATUS_MAPPER.EXIT,
    autoform: {
      type: 'hidden',
      firstOption: false
    }
  },

  // The application allows users to access.
  memberIds: { type: [String], optional: true },

  monit: { type: Object, optional: true, autoform: { type: 'hidden' } },
  'monit.memory': { type: Number },
  'monit.cpu': { type: Number },

  // ENVIRONMENT VARIABLES
  env: { type: Object },
  'env.ROOT_URL': { type: String, regEx: SimpleSchema.RegEx.Url, unique: true },
  'env.MONGO_URL': { type: String, optional: true },
  'env.MAIL_URL': { type: String, optional: true },
  'env.PORT': { type: Number, optional: true },
  'env.DISABLE_WEBSOCKETS': { type: Number, optional: true },
  'env.MONGO_OPLOG_URL': { type: String, optional: true },

  bundleId: {
    type: String,
    label: 'Bundle',
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: Bundles
      }
    }
  }
}));

Applications.helpers({
  logs() {
    return Logs.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },

  members() {
    return Users.find({
      _id: {
        $in: this.memberIds
      }
    }, {
      sort: {
        createdAt: 1
      }
    });
  },

  bundle() {
    return Bundles.findOne(this.bundleId);
  },

  absoluteUrl() {
    return Dev.isDevelopmentReturned(`http://localhost:${this.env.PORT}`, this.env.ROOT_URL);
  },

  setStatus(statusCode) {
    return Applications.update(this._id, {
      $set: {
        status: STATUS_ALLOWED_VALUES[statusCode]
      }
    });
  },

  isStop() {
    return _.isEqual(this.status, STATUS_MAPPER.STOP);
  },

  isExit() {
    return _.isEqual(this.status, STATUS_MAPPER.EXIT);
  },

  isOnline() {
    return _.isEqual(this.status, STATUS_MAPPER.ONLINE);
  },

  isReady() {
    return _.isEqual(this.status, STATUS_MAPPER.READY);
  }
});