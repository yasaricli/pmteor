import './templates.html';

import { Template } from 'meteor/templating';
import { Applications } from '../../../api/applications/applications.js';
import { Logs } from '../../../api/logs/logs.js';
import { STATUS_MAPPER } from '../../../api/applications/utils.js';


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
