import './templates.html';

import { Template } from 'meteor/templating';
import { Applications } from '../../../api/applications/applications.js';
import { Monitoring } from '../../lib/monitoring.js';

Template.monitoring.onRendered(function() {
  const self = this;
  const { application } = this.data;

  if (application.isOnline()) {
    this.charts = new Monitoring();

    // OBSERVE
    this.cursor = Applications.find(application._id).observe({
      changed(doc) {

        // PUSH NEW MEMORY AND CPU
        self.charts.add(doc.monit);

        // RELOAD
        self.charts.reload();
      }
    });
  }
});

// CURSOR OBSERVE STOP
Template.monitoring.onDestroyed(function() {
  if (this.cursor) {
    this.cursor.stop();
  }
});

Template.updateApplicationModal.onCreated(function() {
  this.subscribe('application', this.data._id);
});


// Try the included basicTabs template. First, register it with ReactiveTabs:
ReactiveTabs.createInterface({
  template: 'basicTabs'
});
