import './templates.html';

import { Template } from 'meteor/templating';
import { Applications } from '../../../api/applications/applications.js';

Template.applications.helpers({
  apps() {
    return Applications.find({}, {
      sort: {
        createdAt: -1
      }
    });
  }
});

Template.updateApplicationModal.helpers({
  application() {
    return Applications.findOne(this._id);
  }
});

Template.insertApplicationModal.helpers({
  collection() {
    return Applications;
  }
});

Template.updateApplicationModal.inheritsHelpersFrom('insertApplicationModal');
Template.membersModal.inheritsHelpersFrom('updateApplicationModal');
