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
  members: { type: [Object], optional: true },
  'members.$.userId': { type: String },

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
  logs(f = {}) {
    const filter = Object.assign(f, {
      applicationId: this._id
    });

    return Logs.find(filter, {
      sort: {
        createdAt: -1
      }
    });
  },

  errors() {
    return this.logs({
      type: STATUS_ALLOWED_VALUES[4] // ERRORED STATUS CODE
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

  isOnline() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[2]);
  },

  isStop() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[0]);
  },

  isExit() {
    return _.isEqual(this.status, STATUS_ALLOWED_VALUES[1]);
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
    }
  });

  Applications.before.insert((userId, doc) => {

    // MONGO URL DEFAULT
    doc.env.MONGO_URL = `mongodb://localhost:27017/${doc.bundleId}`;

    // DEFAULT MEMBER ADMIN USER
    doc.members = [{ userId }];
  });

  Applications.after.remove((userId, doc) => {

    // Applications all logs removed.
    Logs.remove({
      applicationId: doc._id
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
