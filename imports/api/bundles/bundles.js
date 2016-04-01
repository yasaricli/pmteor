import { FS } from 'meteor/cfs:base-package';
import { Applications } from '../applications/applications.js';
import { BUNDLE_DIR, MAX_BUNDLE_SIZE } from './utils.js';

export const Bundles = new FS.Collection("bundles", {

  // BUNDLES STORES LIST see libs/utils.js
  stores: [
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
  ],

  // MERGE BUNDLES FILTER OBJECT libs/utils.js
  filter: {
    allow: {
      contentTypes: ['application/x-gzip'],
      extensions: ['gz']
    }
  }
});
