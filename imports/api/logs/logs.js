import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Applications } from '../applications/applications.js';
import { ALLOWED_LOG_TYPES } from './utils.js';

export const Logs = new Mongo.Collection('logs');

// Attach behaviour with the default options
Logs.attachBehaviour('timestampable');

// SCHEMA
Logs.attachSchema(new SimpleSchema({

  // PROCESS OBJECT PM2 LOGS
  process: { type: Object },

  // PROCESS ID
  'process.pm_id': { type: String, optional: true },

  // APPLICATION BUNDLE ID
  'process.name': { type: String },

  // TODO: What =?
  'process.rev': { type: String, optional: true },

  // ALLOWED VALUES
  type: {
    type: String,
    allowedValues: ALLOWED_LOG_TYPES
  },

  // DATE SECCONDS
  at: { type: Number, optional: true },

  // ERROR OR LOG.
  data: { type: String }
}));
