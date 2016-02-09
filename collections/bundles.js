Bundles = new FS.Collection("bundles", {
  stores: [ BundlesStore ],
  filter: {
    allow: {
      contentTypes: ['application/x-gzip'],
      extensions: ['gz']
    }
  }
});

isServer(() => {
  Bundles.on('stored', Meteor.bindEnvironment(function(file, storeName) {
    const tar = `${file.collectionName}-${file._id}-${file.name()}`;

    // CD BUNDLE DIR
    shell.cd(BUNDLE_DIR);

    // GENERATE BUNDLE DIR
    shell.mkdir(file._id);

    // EXTRACT APPLICATION
    shell.exec(`tar -xf ${tar} -C ${file._id} --strip 1`);

    // REMOVE
    shell.rm('-rf', tar);
  }));
});
