Bundles = new FS.Collection("bundles", {
  stores: [
    new FS.Store.FileSystem("bundles", { path: BUNDLE_DIR })
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
    shell.cd(BUNDLE_DIR);

    // IF NOT EXISTS DIR
    if (!shell.test('-e', file._id)) {
      // GENERATE BUNDLE DIR
      shell.mkdir(file._id);

      // EXTRACT APPLICATION
      shell.exec(`tar -xf ${tar} -C ${file._id} --strip 1`, { silent: true });

      // REMOVE
      shell.rm('-rf', tar);

      // CD SERVER PACKAGES
      shell.cd(`${file._id}/programs/server`);

      // NPM PACKAGES INSTALL
      const child = shell.exec('npm install', { silent: true, async: true  });

      /* || bindEnvironment
       *
       * if npm install completed then update
       * application status READY..
       */
      child.stdout.on('end', Meteor.bindEnvironment(() => {
        Applications.update({ bundleId: file._id }, {
          $set: {
            status: STATUS_ALLOWED_VALUES[3] // READY
          }
        });
      }));
    }
  }));
});
