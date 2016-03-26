Applications = new Mongo.Collection('applications');

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
    defaultValue: STATUS_ALLOWED_VALUES[1], // EXIT.
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
        collection: "bundles"
      }
    }
  }
}));

Applications.helpers({
  logs() {
    return Logs.find({}, { ...SORT_FILTERS });
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
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[0]);
  },

  isExit() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[1]);
  },

  isOnline() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[2]);
  },

  isReady() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[3]);
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

  Applications.before.update((userId, doc, fieldNames, modifier, options) => {
    if (_.has(modifier.$set, 'status')) {

      // INSERT ERROR LOG
      Logs.insert({
        applicationId: doc._id,
        type: modifier.$set.status
      });
    }
  });
});
