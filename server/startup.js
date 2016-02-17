Meteor.startup(() => {

  // Bus system - event monitoring
  pm2.launchBus(Meteor.bindEnvironment((err, bus) => {
    if (_.isNull(err)) {

      // PROCESS ALL EVENTS
      bus.on('process:event', Meteor.bindEnvironment((query) => {
        const { PORT, name } = query.process;

        console.log(PORT);
        // IS ONLINE EVENT THEN UPDATE APPLICATION
        if (_.isEqual(query.event, 'online')) {
          Applications.update(name, {
            $set: {
              status: STATUS_ALLOWED_VALUES[2],
              'env.PORT': PORT
            }
          });
        }
      }));

      // IF ERROR THEN ON EVENT
      bus.on('log:err', Meteor.bindEnvironment((query) => {
        const { name } = query.process;

        // UPDATE APPLICATION
        Applications.update(name, {
          $set: {
            status: STATUS_ALLOWED_VALUES[4]
          }
        }, () => {

          // INSERT LOG
          Logs.insert({
            applicationId: name,
            type: STATUS_ALLOWED_VALUES[4],
            data: query.data
          });
        });
      }));
    }
  }));
});
