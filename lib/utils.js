// Said bundle of where to be found.
BUNDLE_DIR = Dev.isServer(() => {

  // if the developer mode if you then installed in the default folder.
  if (Dev.isDevelopment) {
    return '/tmp/bundles';
  }

  // BUNDLE DIR
  return process.env.BUNDLE_DIR;
});


// Say say the state's maximum file upload limit implementation.
MAX_BUNDLE_SIZE = Dev.isServer(() => {

  // if is development then upload limit 50MB
  if (Dev.isDevelopment) {
    return 50 * 1024 * 1024;
  }

  // if productin then max limit unlimited or optional.
  process.env.MAX_BUNDLE_SIZE;
});

ASYNC_EXEC_OPTIONS = {
  async: true,
  silent: true
};

SYNC_EXEC_OPTIONS = {
  async: false,
  silent: true
};

SORT_FILTERS = {
  sort: {
    createdAt: -1
  }
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
