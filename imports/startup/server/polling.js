import { Meteor } from 'meteor/meteor';
import { Applications } from '../../api/applications/applications.js';
import { Logs } from '../../api/logs/logs.js';
import { STATUS_MAPPER } from '../../api/applications/utils.js';

// NPM PACKAGES
import pm2 from 'pm2';

Meteor.startup(() => {

  // INTERVAL LIST APPLICATIONS MONITORING
  Meteor.setInterval(Meteor.bindEnvironment(() => {
    pm2.connect(Meteor.bindEnvironment((connect_err) => {
      if (_.isNull(connect_err)) {
        pm2.list(Meteor.bindEnvironment((list_err, procs) => {
          const onlines = _.reject(procs, (proc) => _.isEqual(proc.pid, 0));

          if (onlines.length) {
            onlines.forEach(Meteor.bindEnvironment((proc) => {
              const { name, monit } = proc;

              Applications.update({ bundleId: name }, {
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
        const application = Applications.findOne({ bundleId: name });

        if (application) {

          // CHANGE STATUS
          Applications.update({ bundleId: name }, {
            $set: {
              status: STATUS_MAPPER[query.event.toUpperCase()],
              'env.PORT': PORT
            }
          });
        }
      }));

      // IF ERROR THEN ON EVENT
      bus.on('log:err', Meteor.bindEnvironment((query) => {
        const { name } = query.process;
        const application = Applications.findOne({ bundleId: name });

        // INSERT ERROR LOG
        if (application) {
          Logs.insert({
            applicationId: application._id,
            type: STATUS_MAPPER.ERRORED,
            data: query.data
          });
        }
      }));
    }
  }));

  /*
   * IMPORTANT!!!!!
   *
   * if the system update is done, and also not in the developer
   * options, then stop all applications.
   */
   pm2.connect(() => {
     pm2.list((err, procs) => {
       const _ids = _.without(procs.map((proc) => proc.name), 'pmteor');

       // stop list applications.
       _.forEach(_ids, (_id) => pm2.stop(_id, () => {

       }));
     });
   });
});
