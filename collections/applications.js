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

  port: {
    type: Number,
    optional: true,
    autoform: { type: 'hidden' }
  },

  // APPLICATION BUS LOGS.
  logs: {
    type: [Object],
    optional: true,
    autoform: { type: 'hidden' }
  },

  'logs.$.type': { type: String },
  'logs.$.data': { type: String },
  'logs.$.createdAt': { type: Date },

  // ENVIRONMENT_VARIABLES LIST
  env: { type: [Object] },

  'env.$.key': {
    type: String,
    allowedValues: ENVIRONMENT_VARIABLES,
    autoform: { firstOption: false }
  },

  'env.$.val': { type: String },

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
  bundle() {
    return Bundles.findOne(this.bundleId);
  }
});

isServer(() => {
  Applications.helpers({
    dir() {
      return `${BUNDLE_DIR}/${this.bundleId}`;
    },
    toEnv() {
      let out = {};
      _.forEach(this.env, (env) => {
        Object.assign(out, {
          [env.key]: env.val
        })
      });
      return out;
    },
    toPm2(PORT) {
      return {

        // name your app will have in PM2
        name: this.bundleId,

        // path of your app
        script: 'main.js',

        // the directory from which your app will be launched
        cwd: this.dir(),

        // env variables which will appear in your app
        env: _.extend(this.toEnv(), { PORT }),

        // Enabling Harmony ES6
        "node-arg": ["--harmony"]
      }
    }
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

    // PROGRESS
    Applications.update(doc._id, {
      $set: {
        status: STATUS_ALLOWED_VALUES[1]
      }
    });

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
