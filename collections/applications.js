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

  // APPLICATION BUS LOGS.
  logs: { type: [Object], optional: true, autoform: { type: 'hidden' } },
  'logs.$.type': { type: String },
  'logs.$.data': { type: String },
  'logs.$.createdAt': { type: Date },

  // ENVIRONMENT VARIABLES
  env: { type: Object },
  'env.ROOT_URL': { type: String },
  'env.DISABLE_WEBSOCKETS': { type: Number, optional: true},
  'env.MONGO_OPLOG_URL': { type: String, optional: true },
  'env.MAIL_URL': { type: String, optional: true },

  // HIDDEN ENVIRONMENTS
  'env.MONGO_URL': { type: String, optional: true, autoform: { type: 'hidden' } },
  'env.PORT': { type: Number, optional: true, autoform: { type: 'hidden' } },

  bundleId: {
    type: String,
    label: 'Bundle',
    denyUpdate: true,
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: "bundles"
      }
    }
  }
}));

Applications.helpers({
  bundle() {
    return Bundles.findOne(this.bundleId);
  }
});

isServer(() => {
  Applications.helpers({
    dir() {
      return `${process.env.BUNDLE_DIR}/${this.bundleId}`;
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
        name: this.bundleId,
        script: 'main.js',
        cwd: this.dir(),
        env: _.extend(this.env, {
          PORT: this.env.PORT || PORT,
        }),

        // static args
        "node-arg": ["--harmony"]
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
          pm2.stop(doc.bundleId, (delete_err) => {

            // DISCONNECT
            pm2.disconnect();
          });
        });
      }
    }
  });

  Applications.before.remove((userId, doc) => {
    const application = Applications.findOne(doc._id);

    // STATUS
    application.setStatus(1); // PROGRESS

    pm2.connect((connect_err) => {
      pm2.delete(doc.bundleId, (delete_err) => {

        // EXIST DIR
        if (shell.test('-e', application.dir())) {

          // REMOVE DIR
          shell.rm('-rf', application.dir());
        }

        // DISCONNECT
        pm2.disconnect();
      });
    });
  });
});
