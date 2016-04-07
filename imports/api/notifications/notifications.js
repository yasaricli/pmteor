import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Notifications = new Mongo.Collection('notifications');

// Attach behaviour with the default options
Notifications.attachBehaviour('timestampable');

// SCHEMA
Notifications.attachSchema(new SimpleSchema({
  applicationId: { type: String },

  type: {
    type: String,
    allowedValues: ['error', 'warning', 'info', 'success']
  },

  message: { type: String }
}));
