Applications = new Mongo.Collection('applications');

// Attach behaviour with the default options
Applications.attachBehaviour('timestampable');

// SCHEMA
Applications.attachSchema(new SimpleSchema({
  name: {
    type: String,
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
    autoform: {
      type: 'hidden'
    }
  },

  // environments
  env: {
    type: [Object]
  },

  'env.$.key': { type: String },
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
        name: this.bundleId,
        cwd: `${BUNDLE_DIR}/${this.bundleId}`,
        script: 'main.js',
        env: _.extend(this.toEnv(), { PORT })
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

        // REMOVE DIR
        shell.rm('-rf', application.dir());

        // DISCONNECT
        pm2.disconnect();
      });
    });
  });
});
