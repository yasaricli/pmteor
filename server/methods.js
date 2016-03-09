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

  stop(_id) {
    const application = Applications.findOne(_id);

    pm2.connect((connect_err) => {
      pm2.stop(application.bundleId, (delete_err) => {

        // DISCONNECT
        pm2.disconnect();
      });
    });
  },

  delete(_id) {
    const application = Applications.findOne(_id);

    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Applications.remove(application._id, () => {
        pm2.connect((connect_err) => {
          pm2.delete(application.bundleId, (delete_err) => {

            // CD BUNDLES DIR
            shell.cd(BUNDLE_DIR);

            // REMOVE APPLICATON DIR AND BUNDLE FILE
            shell.rm('-rf', [

              // DIR
              application.bundleId,

              // TAR.GZ
              `${application.bundleId}.tar.gz`
            ]);

            // DISCONNECT
            pm2.disconnect();
          });
        });
      });
    }

    // if user not in role then
    throw new Meteor.Error(403, "Not user administrator. That's why you can not delete.");
  }
});
