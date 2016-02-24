Bundles = new FS.Collection("bundles", {
  stores: [
    new FS.Store.FileSystem("bundles", {
      path: Meteor.isServer ? process.env.BUNDLE_DIR : null,

      // New Name file _id.
      fileKeyMaker(fileObj) {
        return fileObj._id;
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['application/x-gzip'],
      extensions: ['gz']
    }
  }
});

isServer(() => {
  Bundles.on('uploaded', Meteor.bindEnvironment((file, storeName) => {
    Meteor.setTimeout(() => {
      const application = Applications.findOne({
        bundleId: file._id
      });

      // IF APPLICATION NOT FOUND THEN NOT RETURN!
      if (_.isUndefined(application)) {
        // AUTOFORM UPLOAD FIELD UNIQ BUG!
        return;
      }

      // UPDATE STATUS PROGRESS
      application.setStatus(1);

      // CD BUNDLE DIR
      shell.cd(process.env.BUNDLE_DIR);

      // REMOVE OLD APPLICATION
      shell.rm('-rf', application._id);

      // CREATE NEW APPLICATION DIR
      shell.mkdir(application._id);

      // EXTRACT
      const extract = shell.exec(`tar -xf ${file._id} -C ${application._id} --strip 1`, ASYNC_EXEC_OPTIONS);

      extract.stdout.on('end', Meteor.bindEnvironment(() => {

        // CD SERVER PACKAGES
        shell.cd(`${application.dir()}/programs/server`);

        // NPM CORE PACKAGES INSTALL
        const npm = shell.exec('npm install', ASYNC_EXEC_OPTIONS);

        npm.stdout.on('end', Meteor.bindEnvironment(() => {

          // FIX BCRYPT
          if (shell.test('-e', 'npm/npm-bcrypt')) {
            shell.exec('npm install bcrypt', SYNC_EXEC_OPTIONS);
            shell.rm('-rf', 'npm/npm-bcrypt');
          }

          // FIX BSON
          if (shell.test('-e', 'npm/cfs_gridfs')) {
            shell.cd('npm/cfs_gridfs/node_modules/mongodb/node_modules/bson');
            shell.exec('make', SYNC_EXEC_OPTIONS);
          }

          // READY
          application.setStatus(3);
        }));
      }));
    }, 1000);
  }));
});
