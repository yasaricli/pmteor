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
    defaultValue: STATUS_ALLOWED_VALUES[0], // Created Default Value.
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
});
