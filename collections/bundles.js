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
  Bundles.on('stored', (file, storeName) => {
    const tar = `${file.collectionName}-${file._id}-${file.name()}`;

    // CD BUNDLE DIR
    shell.cd(BUNDLE_DIR);

    // GENERATE BUNDLE DIR
    shell.mkdir(file._id);

    // EXTRACT APPLICATION
    shell.exec(`tar -xf ${tar} -C ${file._id} --strip 1`);

    // REMOVE
    shell.rm('-rf', tar);

    // CD SERVER PACKAGES
    shell.cd(`${file._id}/programs/server`);

    // NPM PACKAGES INSTALL
    shell.exec('npm install');
  });
});
