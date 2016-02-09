// Upload Collectionfs bundles directories
BUNDLE_DIR = '~/Desktop/bundles';

BundlesStore = new FS.Store.FileSystem("bundles", {
  path: BUNDLE_DIR
});
