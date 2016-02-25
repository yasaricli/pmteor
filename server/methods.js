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

  delete(_id) {
    const application = Applications.findOne(_id);
    if (application) {
      Applications.remove(application._id, () => {
        pm2.connect((connect_err) => {
          pm2.delete(application._id, (delete_err) => {

            shell.cd(`${process.env.BUNDLE_DIR}`);

            // REMOVE APPLICATON DIR AND BUNDLE FILE
            shell.rm('-rf', [ application._id, application.bundleId ]);

            // DISCONNECT
            pm2.disconnect();
          });
        });
      });
    }
  },

  stop(_id) {
    const application = Applications.findOne(_id);

    pm2.connect((connect_err) => {
      pm2.stop(application._id, (delete_err) => {

        // DISCONNECT
        pm2.disconnect();
      });
    });
  }
});
