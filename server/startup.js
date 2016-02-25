Meteor.startup(() => {

  // INTERVAL LIST APPLICATIONS MONITORING
  Meteor.setInterval(Meteor.bindEnvironment(() => {
    pm2.connect(Meteor.bindEnvironment((connect_err) => {
      if (_.isNull(connect_err)) {
        pm2.list(Meteor.bindEnvironment((list_err, procs) => {
          const onlines = _.filter(procs, (proc) => {
            return !_.isEqual(proc.pid, 0);
          });

          if (!_.isEmpty(onlines)) {
            onlines.forEach(Meteor.bindEnvironment((proc) => {
              const { name, monit } = proc;

              // UPDATE MONITORING
              Applications.update(name, {
                $set: {
                  monit
                }
              });
            }));
          }
        }));
      }
    }));
  }), 10000); // 10 seconds.

  // Bus system - event monitoring
  pm2.launchBus(Meteor.bindEnvironment((err, bus) => {
    if (_.isNull(err)) {

      // PROCESS ALL EVENTS
      bus.on('process:event', Meteor.bindEnvironment((query) => {
        const { PORT, name } = query.process;

        // SET STATUS QUERY EVENT
        Applications.update(name, {
          $set: {
            status: STATUS_MAPPER[query.event.toUpperCase()],
            'env.PORT': PORT
          }
        });
      }));

      // IF ERROR THEN ON EVENT
      bus.on('log:err', Meteor.bindEnvironment((query) => {
        const { name } = query.process;

        // INSERT ERROR LOG
        Logs.insert({
          applicationId: name,
          type: STATUS_ALLOWED_VALUES[4],
          data: query.data
        });
      }));
    }
  }));
});
