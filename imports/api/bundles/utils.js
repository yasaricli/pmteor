import { FS } from 'meteor/cfs:base-package';
import { Dev } from 'meteor/pmteor:dev';

// Said bundle of where to be found.
const BUNDLE_DIR = Dev.isServer(() => {

  // if the developer mode if you then installed in the default folder.
  if (Dev.isDevelopment) {
    return `${process.env.HOME}/bundles`;
  }

  // BUNDLE DIR
  return process.env.BUNDLE_DIR;
});

// Say say the state's maximum file upload limit implementation.
const MAX_BUNDLE_SIZE = Dev.isServer(() => {

  // if is development then upload limit 50MB
  if (Dev.isDevelopment) {
    return 50 * 1024 * 1024;
  }

  // if productin then max limit unlimited or optional.
  process.env.MAX_BUNDLE_SIZE;
});

const ASYNC_EXEC_OPTIONS = {
  async: true,
  silent: Dev.isDevelopmentReturned(false, true)
};

const SYNC_EXEC_OPTIONS = {
  async: false,
  silent: Dev.isDevelopmentReturned(false, true)
};

export {
  BUNDLE_DIR,
  MAX_BUNDLE_SIZE,
  ASYNC_EXEC_OPTIONS,
  SYNC_EXEC_OPTIONS
};
