import { Logs } from '../logs.js';

// HELPERS
Logs.helpers({
  application() {
    return Applications.findOne(this.applicationId);
  }
});
