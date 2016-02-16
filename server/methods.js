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

  install(bundleId) {
    const application = Applications.findOne({ bundleId });

    // UPDATE STATUS PROGRESS
    application.setStatus(1);

    // CD SERVER PACKAGES
    shell.cd(`${application.dir()}/programs/server`);

    // NPM PACKAGES INSTALL
    const install = shell.exec('npm install', EXEC_OPTIONS);

    install.stdout.on('end', Meteor.bindEnvironment(() => {

      // INSTALL COMPLETED UPDATE STATUS
      application.setStatus(3);

      // FIX PACKAGES
      if (shell.test('-e', 'npm/npm-bcrypt')) {

        // PROGRESS
        application.setStatus(1);

        // NPM BCRYPT INSTALL
        const bcrypt = shell.exec('npm install bcrypt', EXEC_OPTIONS);

        // bcrypt end then
        return bcrypt.stdout.on('end', Meteor.bindEnvironment(() => {

          // READY
          application.setStatus(3);

          // REMOVE bcrypt DIR
          shell.rm('-rf', 'npm/npm-bcrypt');

          // cfs_gridfs FIX
          if (shell.test('-e', 'npm/cfs_gridfs')) {

            // PROGRESS
            application.setStatus(1);

            // CD BSON MODULE
            shell.cd('npm/cfs_gridfs/node_modules/mongodb/node_modules/bson');

            // MAKE COMMAND
            const make = shell.exec('make', EXEC_OPTIONS);

            // MAKE END THEN
            return make.stdout.on('end', Meteor.bindEnvironment(() => {

              // PROGRESS
              application.setStatus(3);
            }));
          }
        }));
      }
    }));
  }
});
