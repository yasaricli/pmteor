import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';


import { Applications } from '../../api/applications/applications.js';
import { Logs } from '../../api/logs/logs.js';
import { STATUS_MAPPER } from '../../api/applications/utils.js';
import { ALLOWED_LOG_TYPES } from '../../api/logs/utils.js';


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
              const { pm_uptime, restart_time } = proc.pm2_env;

              Applications.update({ bundleId: name }, {
                $set: {
                  monit: {

                    // UPTIME AND RESTART TIME
                    pm_uptime,
                    restart_time,

                    // MONIT OBJECT INJECT
                    ...monit
                  }
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

      bus.on('*', Meteor.bindEnvironment((type, query) => {
        let { PORT, name } = query.process;
        const application = Applications.findOne({ bundleId: name });

        if (application) {


          // EVENTS STOP, START, ...
          if (_.isEqual(type, 'process:event')) {

            // CHANGE STATUS
            return Applications.update({ bundleId: name }, {
              $set: {
                status: STATUS_MAPPER[query.event.toUpperCase()],
                'env.PORT': PORT
              }
            });
          }
        }

        // ALLOWED TYPES INSERT LOG
        if (_.contains(ALLOWED_LOG_TYPES, type)) {

          // OMIT AT KEY AND INSERT LOG
          Logs.insert(_.defaults({ type }, query));
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
