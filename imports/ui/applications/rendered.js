import './templates.html';

import { Template } from 'meteor/templating';
import { MorrisApps } from '../lib/morris.js';
import { Applications } from '../../collections/applications/applications.js';

Template.application.onRendered(function() {

  // if null application data then deny.
  if (_.isNull(this.data)) {
    return;
  }

  if (this.data.isOnline()) {
    const morris = new MorrisApps();

    // OBSERVE
    this.cursor = Applications.find(this.data._id).observe({
      changed(doc) {

        // PUSH NEW MEMORY AND CPU
        morris.add(doc.monit);

        // RELOAD
        morris.reload();
      }
    });
  }
});

Template.application.onDestroyed(function() {
  // CURSOR OBSERVE SROP
  if (this.cursor) {
    this.cursor.stop();
  }
});

Template.updateApplicationModal.onCreated(function() {
  this.subscribe('application', this.data._id);
});
