Bundles = new FS.Collection("bundles", {
  stores: [
    new FS.Store.FileSystem("bundles", {
      path: Meteor.isServer ? process.env.BUNDLE_DIR : null
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
  Bundles.on('stored', Meteor.bindEnvironment((file, storeName) => {
    const tar = `${file.collectionName}-${file._id}-${file.name()}`;

    // CD BUNDLE DIR
    shell.cd(process.env.BUNDLE_DIR);

    // IF NOT EXISTS DIR
    if (!shell.test('-e', file._id)) {

      // GENERATE BUNDLE DIR
      shell.mkdir(file._id);

      // EXTRACT APPLICATION
      const extract = shell.exec(`tar -xf ${tar} -C ${file._id} --strip 1`, EXEC_OPTIONS);

      // extract ended callback.
      extract.stdout.on('end', Meteor.bindEnvironment(() => {

        // REMOVE BUNDLE
        Bundles.remove(file._id);

        // CD SERVER PACKAGES
        shell.cd(`${file._id}/programs/server`);

        // NPM PACKAGES INSTALL
        const install = shell.exec('npm install', EXEC_OPTIONS);

        /* || bindEnvironment
         *
         * if npm install completed then update
         * application status READY..
         */
        install.stdout.on('end', Meteor.bindEnvironment(() => {

          // npm-bcrypt
          if (shell.test('-e', 'npm/npm-bcrypt')) {
            const bcrypt = shell.exec('npm install bcrypt', EXEC_OPTIONS);

            // bcrypt end then
            return bcrypt.stdout.on('end', Meteor.bindEnvironment(() => {

              // REMOVE bcrypt DIR
              shell.rm('-rf', 'npm/npm-bcrypt');

              // UPDATE STATUS
              Applications.update({ bundleId: file._id }, {
                $set: {
                  status: STATUS_ALLOWED_VALUES[3] // READY
                }
              });
            }));
          }

          // UPDATE STATUS
          Applications.update({ bundleId: file._id }, {
            $set: {
              status: STATUS_ALLOWED_VALUES[3] // READY
            }
          });
        }));
      }));
    }
  }));
});
