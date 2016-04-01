import { _ } from 'meteor/underscore';

import { Users } from '../../users/users.js';
import { Applications } from '../applications.js';
import { BUNDLE_DIR } from '../../bundles/utils.js';

// NPM PACKAGES
import pm2 from 'pm2';
import freeport from 'freeport';

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
      env: _.defaults({ PORT }, this.env)
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
