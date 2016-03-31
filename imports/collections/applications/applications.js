import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Dev } from 'meteor/pmteor:dev';

import { Logs } from '../logs/logs.js';
import { Users } from '../users/users.js';
import { Bundles } from '../bundles/bundles.js';
import { STATUS_ALLOWED_VALUES, STATUS_MAPPER } from './utils.js';

export const Applications = new Mongo.Collection('applications');

// Attach behaviour with the default options
Applications.attachBehaviour('timestampable');

// SCHEMA
Applications.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true,
    label: 'Application Name'
  },

  status: {
    type: String,
    allowedValues: STATUS_ALLOWED_VALUES,
    defaultValue: STATUS_MAPPER.EXIT,
    autoform: {
      type: 'hidden',
      firstOption: false
    }
  },

  // The application allows users to access.
  memberIds: { type: [String], optional: true },

  monit: { type: Object, optional: true, autoform: { type: 'hidden' } },
  'monit.memory': { type: Number },
  'monit.cpu': { type: Number },

  // ENVIRONMENT VARIABLES
  env: { type: Object },
  'env.ROOT_URL': { type: String, regEx: SimpleSchema.RegEx.Url, unique: true },
  'env.MONGO_URL': { type: String, optional: true },
  'env.MAIL_URL': { type: String, optional: true },
  'env.PORT': { type: Number, optional: true },
  'env.DISABLE_WEBSOCKETS': { type: Number, optional: true },
  'env.MONGO_OPLOG_URL': { type: String, optional: true },

  bundleId: {
    type: String,
    label: 'Bundle',
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: Bundles
      }
    }
  }
}));

Applications.helpers({
  logs() {
    return Logs.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },

  members() {
    return Users.find({
      _id: {
        $in: this.memberIds
      }
    }, {
      sort: {
        createdAt: 1
      }
    });
  },

  bundle() {
    return Bundles.findOne(this.bundleId);
  },

  absoluteUrl() {
    return Dev.isDevelopmentReturned(`http://localhost:${this.env.PORT}`, this.env.ROOT_URL);
  },

  setStatus(statusCode) {
    return Applications.update(this._id, {
      $set: {
        status: STATUS_ALLOWED_VALUES[statusCode]
      }
    });
  },

  isStop() {
    return _.isEqual(this.status, STATUS_MAPPER.STOP);
  },

  isExit() {
    return _.isEqual(this.status, STATUS_MAPPER.EXIT);
  },

  isOnline() {
    return _.isEqual(this.status, STATUS_MAPPER.ONLINE);
  },

  isReady() {
    return _.isEqual(this.status, STATUS_MAPPER.READY);
  }
});

Dev.isServer(() => {
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
        shell.cd(BUNDLE_DIR);

        // REMOVE APPLICATON DIR AND BUNDLE FILE
        shell.rm('-rf', [

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
});
