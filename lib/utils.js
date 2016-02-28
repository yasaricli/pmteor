// IS DEVELOPMENT THEN DEFAULT BUNDLE DIR TEMP.
BUNDLE_DIR = Dev.isDevelopment ? '/tmp/bundles' : process.env.BUNDLE_DIR;

// maxSize STORE DEFAULT "50 MB"
MAX_BUNDLE_SIZE = Dev.isDevelopment ?  50 * 1024 * 1024 : process.env.MAX_BUNDLE_SIZE;

ASYNC_EXEC_OPTIONS = {
  async: true,
  silent: true
};

SYNC_EXEC_OPTIONS = {
  async: false,
  silent: true
};

STATUS_ALLOWED_VALUES = ['STOP', 'EXIT', 'ONLINE', 'READY', 'ERRORED', 'RESTART', 'RESTART OVERLIMIT'];

STATUS_MAPPER = {
  'STOP': STATUS_ALLOWED_VALUES[0],
  'EXIT': STATUS_ALLOWED_VALUES[1],
  'ONLINE': STATUS_ALLOWED_VALUES[2],
  'READY': STATUS_ALLOWED_VALUES[3],
  'ERRORED': STATUS_ALLOWED_VALUES[4],
  'RESTART': STATUS_ALLOWED_VALUES[2]
}

BUNDLES_STORE_FILTER = {
  filter: {
    allow: {
      contentTypes: ['application/x-gzip'],
      extensions: ['gz']
    }
  }
};

BUNDLES_STORES = [
  new FS.Store.FileSystem("bundles", {

    // BUNDLE UPLOAD DIR
    path: BUNDLE_DIR,

    // MAX BUNDLE FILE SIZE
    maxSize: MAX_BUNDLE_SIZE,

    // New Name file _id.
    fileKeyMaker(fileObj) {
      return `${fileObj._id}.tar.gz`;
    }
  })
];
