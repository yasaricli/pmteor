import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Applications } from '../applications/applications.js';

class LogsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const result = super.insert(doc, callback);
    const application = Applications.findOne(doc.applicationId);

    // HAS APPLICATION
    if (application) {

      // SEND EMAILS
      application.sendEmailMembers('log', {
        application
      });
    }

    return result;
  }
}

export const Logs = new LogsCollection('logs');

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
