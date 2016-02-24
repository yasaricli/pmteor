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
  Bundles.on('stored', Meteor.bindEnvironment((file, storeName) => {
    const application = Applications.findOne({
      bundleId: file._id
    });

    // CD BUNDLE DIR
    shell.cd(process.env.BUNDLE_DIR);

    // REMOVE OLD APPLICATION
    shell.rm('-rf', application._id);

    // CREATE NEW APPLICATION DIR
    shell.mkdir(application._id);

    // EXTRACT
    shell.exec(`tar -xf ${file._id} -C ${application._id} --strip 1`, EXEC_OPTIONS);

    // APPLICATION INSTALL STARTED
    application.install();
  }));
});
