import { _ } from 'meteor/underscore';

import { Logs } from '../logs/logs.js';
import { Users } from '../users/users.js';
import { Applications } from './applications.js';

import { BUNDLE_DIR } from '../bundles/utils.js';

// NPM PACKAGES
import pm2 from 'pm2';
import { cd, rm } from 'shelljs';

Applications.helpers({
  dir() {
    return `${BUNDLE_DIR}/${this.bundleId}`;
  },

  options(PORT) {
    return {
      name: this.bundleId,
      script: 'main.js',
      cwd: this.dir(),
      autorestart: false,
      env: _.extend(this.env, {
        PORT: this.env.PORT || PORT,
      })
    }
  },

  start() {
    const self = this;

    // RUNNING UPDATE
    self.setStatus(1);

    /*
     * Listening port and connect production process manager. if connected
     * process manager and started application then change application status
     * to running.
     */
    freeport((freeport_err, port) => {
      if (_.isNull(freeport_err)) {
        pm2.connect((connect_err) => {
          if (_.isNull(connect_err)) {
            pm2.start(self.options(port), () => {

              // DISCONNECT
              pm2.disconnect();
            });
          }
        });
      }
    });
  },

  stop() {
    const self = this;
    pm2.connect((connect_err) => {
      pm2.stop(self.bundleId, (stop_err) => {

        // DISCONNECT
        pm2.disconnect();
      });
    });
  },

  sendEmailMembers(template, data) {
    const members = Users.find({
      _id: {
        $in: this.memberIds
      }
    });

    // USERS EACH
    members.forEach((user) => {

      // MAIL URL PARSE AND EXISTS MAIL URL
      Dev.hasEnv('MAIL_URL', (MAIL_URL) => {
        const { emails } = user;
        const { email } = Dev.parseMailUrl(MAIL_URL);

        // SEND EMAIL
        Email.send({
          from: email,
          to: _.first(emails).address,
          subject: `Pmteor - ${this.name}`,
          html: SSR.render(template, data)
        });
      });
    });
  }
});

Applications.before.insert((userId, doc) => {

  // MONGO URL DEFAULT
  doc.env.MONGO_URL = `mongodb://localhost:27017/${doc.bundleId}`;

  // DEFAULT MEMBER ADMIN USER
  doc.memberIds = [userId];
});

// REMOVE APPLICATION AFTER
Applications.after.remove((userId, doc) => {

  // Applications all logs removed.
  Logs.remove({ applicationId: doc._id });

  // CONNECT AND DELETE APPLICATION
  pm2.connect((connect_err) => {
    pm2.delete(doc.bundleId, (delete_err) => {

      // CD BUNDLES DIR
      cd(BUNDLE_DIR);

      // REMOVE APPLICATON DIR AND BUNDLE FILE
      rm('-rf', [

        // DIR
        doc.bundleId,

        // TAR.GZ
        `${doc.bundleId}.tar.gz`
      ]);

      // DISCONNECT
      pm2.disconnect();
    });
  });
});

Applications.after.update((userId, doc, fieldNames, modifier, options) => {
  if (_.contains(fieldNames, 'status')) {

    // INSERT ERROR LOG
    Logs.insert({ applicationId: doc._id, type: doc.status });
  }
});
