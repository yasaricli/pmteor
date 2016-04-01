import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Applications } from '../applications/applications.js';

export const Logs = new Mongo.Collection('logs');

// Attach behaviour with the default options
Logs.attachBehaviour('timestampable');

// SCHEMA
Logs.attachSchema(new SimpleSchema({
  applicationId: { type: String },
  type: { type: String },
  data: { type: String, optional: true }
}));

// HELPERS
Logs.helpers({
  application() {
    return Applications.findOne(this.applicationId);
  }
});
