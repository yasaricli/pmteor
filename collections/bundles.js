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
        const application = Applications.findOne({ bundleId: file._id });

        // MOVE APPLICATION _ID
        const move = shell.exec(`mv ${file._id} ${application._id}`, EXEC_OPTIONS);

        // COMPLETED MOVE
        move.stdout.on('end', Meteor.bindEnvironment(() => {

          // REMOVE BUNDLE
          Bundles.remove(file._id, () => {

            // NPM INSTALL
            application.install();
          });
        }));
      }));
    }
  }));
});
