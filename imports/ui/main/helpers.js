import './templates.html';

import { Template } from 'meteor/templating';
import { Applications } from '../../collections/applications/applications.js';
import { Logs } from '../../collections/logs/logs.js';

Template.index.helpers({
  apps(status) {
    return Applications.find();
  },

  onlines(status) {
    return Applications.find({
      status: STATUS_MAPPER.ONLINE
    });
  },

  errors() {
    return Logs.find({
      type: STATUS_MAPPER.ERRORED
    });
  }
});
