Meteor.methods({
  start(_id) {
    const app = Applications.findOne(_id);

    // RUNNING UPDATE
    Applications.update(_id, {
      $set: {
        status: STATUS_ALLOWED_VALUES[1]
      }
    });

    /*
     * Listening port and connect production process manager. if connected
     * process manager and started application then change application status
     * to running.
     */
    freeport((freeport_err, port) => {
      if (_.isNull(freeport_err)) {

        pm2.connect((connect_err) => {
          if (_.isNull(connect_err)) {
            pm2.start(app.toPm2(port), () => {

              // DISCONNECT
              pm2.disconnect();
            });
          }
        });
      }
    });
  }
});
