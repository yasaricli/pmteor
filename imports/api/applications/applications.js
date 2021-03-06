import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Dev } from 'meteor/pmteor:dev';

import Users from '../users/users.js';
import { Logs } from '../logs/logs.js';
import { Bundles } from '../bundles/bundles.js';
import { Notifications } from '../notifications/notifications.js';

import { STATUS_ALLOWED_VALUES, NODE_ENV_ALLOWED_VALUES, DEFAULT_NODE_ENV,
  STATUS_MAPPER } from './utils.js';

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
  'monit.restart_time': { type: Number },
  'monit.pm_uptime': { type: Number },
  'monit.memory': { type: Number },
  'monit.cpu': { type: Number },

  // ENVIRONMENT VARIABLES
  env: { type: Object },
  'env.ROOT_URL': { type: String, regEx: SimpleSchema.RegEx.Url, unique: true },
  'env.MONGO_URL': { type: String, optional: true },
  'env.MAIL_URL': { type: String, optional: true },
  'env.PORT': { type: Number, optional: true },
  'env.DISABLE_WEBSOCKETS': { type: Number, optional: true },

  // RUNNING APPLICATION ENV VARIABLE
  'env.NODE_ENV': {
    type: String,
    allowedValues: NODE_ENV_ALLOWED_VALUES,
    defaultValue: DEFAULT_NODE_ENV
  },

  bundleId: {
    type: String,
    label: 'Bundle',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'bundles',
        label: 'Choose application bundle file',
        removeFileBtnTemplate: 'bundleRemoveFileBtn',
        uploadProgressTemplate: 'uploadBundlesProgressTemplate'
      }
    }
  }
}));

Applications.helpers({
  logs(type) {
    const filter = {};

    // if type then set type ket value.
    if (type) {
      filter.type = type;
    }

    // and filter logs.
    return Logs.find(filter, {
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

  notifications(callback) {
    return Notifications.find({
      applicationId: this._id
    }, callback);
  },

  notification({ type, message }) {
    return Notifications.insert({ applicationId: this._id, type, message });
  },

  bundle() {
    return Bundles.findOne(this.bundleId);
  },

  absoluteUrl() {
    return Dev.isDevelopmentReturned(`http://localhost:${this.env.PORT}`, this.env.ROOT_URL);
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
  },

  isProgress() {
    return _.isEqual(this.status, STATUS_MAPPER.PROGRESS);
  }
});
