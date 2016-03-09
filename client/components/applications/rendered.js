Template.application.onRendered(function() {
  if (this.data.isOnline()) {
    const morrisApplications = new MorrisApplications();

    // OBSERVE
    this.cursor = Applications.find(this.data._id).observe({
      changed(doc) {

        // PUSH NEW MEMORY AND CPU
        morrisApplications.add(doc.monit);

        // RELOAD
        morrisApplications.reload();
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
