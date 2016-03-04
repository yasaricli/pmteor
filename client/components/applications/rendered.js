Template.application.onRendered(function() {
  if (!_.isNull(this.data)) {
    const morrisApplications = new MorrisApplications();

    this.cursor = Applications.find(this.data._id).observe({
      changed(doc) {

        // IS ONLINE THEN
        if (_.isEqual(doc.status, STATUS_ALLOWED_VALUES[2])) {

          // PUSH NEW MEMORY AND CPU
          morrisApplications.add(doc.monit);

          // RELOAD
          morrisApplications.reload();
        }
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
