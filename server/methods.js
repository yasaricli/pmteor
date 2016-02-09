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
    freeport(Meteor.bindEnvironment(function(freeport_err, port) {
      if (_.isNull(freeport_err)) {

        pm2.connect(Meteor.bindEnvironment(function(connect_err) {
          if (_.isNull(connect_err)) {

            pm2.start(app.toPm2(port), Meteor.bindEnvironment(function(start_err) {

              // DISCONNECT
              pm2.disconnect();

              if (_.isNull(start_err)) {
                Applications.update(_id, {
                  $set: {
                    port,
                    status: STATUS_ALLOWED_VALUES[2]
                  }
                });
              }
            }));
          }
        }));
      }
    }));
  }
});
