Meteor.methods({
  start(_id) {
    const application = Applications.findOne(_id);

    // RUNNING UPDATE
    application.setStatus(1);

    /*
     * Listening port and connect production process manager. if connected
     * process manager and started application then change application status
     * to running.
     */
    freeport((freeport_err, port) => {
      if (_.isNull(freeport_err)) {
        pm2.connect((connect_err) => {
          if (_.isNull(connect_err)) {
            pm2.start(application.options(port), () => {

              // DISCONNECT
              pm2.disconnect();
            });
          }
        });
      }
    });
  },

  install(_id) {
    const application = Applications.findOne(_id);
    if (application) {
      return application.install();
    }
  }
});
