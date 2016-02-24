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
    defaultValue: STATUS_ALLOWED_VALUES[1], // PROGRESS.
    autoform: {
      type: 'hidden',
      firstOption: false
    }
  },

  monit: { type: Object, optional: true, autoform: { type: 'hidden' } },
  'monit.memory': { type: Number },
  'monit.cpu': { type: Number },

  // ENVIRONMENT VARIABLES
  env: { type: Object },
  'env.ROOT_URL': { type: String, regEx: SimpleSchema.RegEx.Url },
  'env.MONGO_URL': { type: String, optional: true },
  'env.MAIL_URL': { type: String, optional: true },
  'env.PORT': { type: Number, optional: true },
  'env.DISABLE_WEBSOCKETS': { type: Number, optional: true},
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
    return Logs.find({ applicationId: this._id }, {
      sort: {
        createdAt: -1
      }
    });
  },

  bundle() {
    return Bundles.findOne(this.bundleId);
  },

  absoluteUrl() {
    if (isLocal()) {
      return `http://localhost:${this.env.PORT}`
    }
    return this.env.ROOT_URL;
  },

  isOnline() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[2]);
  },

  isStop() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[0]);
  },

  isProgress() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[1]);
  }
});

isServer(() => {
  Applications.helpers({
    dir() {
      return `${process.env.BUNDLE_DIR}/${this._id}`;
    },

    setStatus(index) {
      return Applications.update(this._id, {
        $set: {
          status: STATUS_ALLOWED_VALUES[index]
        }
      });
    },

    options(PORT) {
      return {
        name: this._id,
        script: 'main.js',
        cwd: this.dir(),
        env: _.extend(this.env, {
          PORT: this.env.PORT || PORT,
        })
      }
    }
  });

  Applications.before.insert((userId, doc) => {
    doc.env.MONGO_URL = `mongodb://localhost:27017/${doc._id}`;
  });

  Applications.before.update((userId, doc, fieldNames, modifier, options) => {
    if (_.has(modifier.$set, 'status')) {

      // IF STOPPED THEN
      if (_.isEqual(modifier.$set.status, 'STOPPED')) {
        pm2.connect((connect_err) => {
          pm2.stop(doc._id, (delete_err) => {

            // DISCONNECT
            pm2.disconnect();
          });
        });
      }
    }
  });

  Applications.after.remove((userId, doc) => {
    
    // CONNECT AND DELETE
    pm2.connect((connect_err) => {
      pm2.delete(doc._id, (delete_err) => {

        shell.cd(`${process.env.BUNDLE_DIR}`);

        // REMOVE APPLICATON DIR AND BUNDLE FILE
        shell.rm('-rf', [ doc._id, doc.bundleId ]);

        // DISCONNECT
        pm2.disconnect();
      });
    });

    // Applications all logs removed.
    Logs.remove({
      applicationId: doc._id
    });
  });
});
