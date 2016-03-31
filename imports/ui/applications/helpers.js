import './templates.html';

import { Template } from 'meteor/templating';
import { Applications } from '../../collections/applications/applications.js';


Template.applications.helpers({
  apps() {
    return Applications.find({}, { ...SORT_FILTERS });
  }
});

Template.updateApplicationModal.helpers({
  application() {
    return Applications.findOne(this._id);
  }
});

Template.insertApplicationModal.helpers({
  applications() {
    return Applications;
  }
});

Template.insertApplicationModal.inheritsHelpersFrom('insertApplicationModal');
Template.membersModal.inheritsHelpersFrom('updateApplicationModal');
