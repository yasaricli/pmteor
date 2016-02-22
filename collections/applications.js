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
        }),

        // static args
        "node-arg": ["--harmony"]
      }
    },

    install() {
      const self = this;

      // UPDATE STATUS PROGRESS
      self.setStatus(1);

      // CD SERVER PACKAGES
      shell.cd(`${self.dir()}/programs/server`);

      // NPM PACKAGES INSTALL
      const install = shell.exec('npm install', EXEC_OPTIONS);

      install.stdout.on('end', Meteor.bindEnvironment(() => {

        // READY
        self.setStatus(3);

        // FIX BCRYPT
        if (shell.test('-e', 'npm/npm-bcrypt')) {

          // PROGRESS
          self.setStatus(1);

          const bcrypt = shell.exec('npm install bcrypt', EXEC_OPTIONS);

          // bcrypt end then
          bcrypt.stdout.on('end', Meteor.bindEnvironment(() => {

            // REMOVE bcrypt DIR
            shell.rm('-rf', 'npm/npm-bcrypt');

            // READY
            self.setStatus(3);
          }));
        }

        // FIX BSON
        if (shell.test('-e', 'npm/cfs_gridfs')) {

          // PROGRESS
          self.setStatus(1);

          shell.cd('npm/cfs_gridfs/node_modules/mongodb/node_modules/bson');

          // MAKE COMMAND
          const make = shell.exec('make', EXEC_OPTIONS);

          // MAKE END THEN
          make.stdout.on('end', Meteor.bindEnvironment(() => {

            // READY
            application.setStatus(3);
          }));
        }
      }));
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

  Applications.before.remove((userId, doc) => {
    const application = Applications.findOne(doc._id);

    // STATUS
    application.setStatus(1); // PROGRESS

    pm2.connect((connect_err) => {
      pm2.delete(doc._id, (delete_err) => {

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

  Applications.after.remove((userId, doc) => {

    // Applications all logs removed.
    Logs.remove({
      applicationId: doc._id
    });
  });
});
