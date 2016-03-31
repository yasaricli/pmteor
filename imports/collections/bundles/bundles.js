import { FS } from 'meteor/cfs:base-package';
import { Dev } from 'meteor/pmteor:dev';
import { Modal } from 'meteor/pmteor:modal';
import { Applications } from '../applications/applications.js';

export const Bundles = new FS.Collection("bundles", {

  // BUNDLES STORES LIST see libs/utils.js
  stores: [ ...BUNDLES_STORES ],

  // MERGE BUNDLES FILTER OBJECT libs/utils.js
  ...BUNDLES_STORE_FILTER
});

Dev.isServer(() => {
  Bundles.on('stored', Meteor.bindEnvironment((file, storeName) => {
    const APPLICATION_DIR  = `${BUNDLE_DIR}/${file._id}`;

    // REMOVE OLD APPLICATION
    shell.rm('-rf', APPLICATION_DIR);

    // CREATE NEW APPLICATION DIR
    shell.mkdir(APPLICATION_DIR);

    // GO TO BUNDLE DIR
    shell.cd(BUNDLE_DIR);

    // EXTRACT
    shell.exec(`tar -xvzf ${file._id}.tar.gz -C ${file._id} --strip 1`, SYNC_EXEC_OPTIONS);

    // CD SERVER PACKAGES
    shell.cd(`${file._id}/programs/server`);

    // NPM CORE PACKAGES INSTALL
    const npm = shell.exec('npm install', ASYNC_EXEC_OPTIONS);

    npm.stdout.on('end', Meteor.bindEnvironment(() => {

      // FIX BCRYPT
      if (shell.test('-e', 'npm/npm-bcrypt')) {
        shell.exec('npm install bcrypt', SYNC_EXEC_OPTIONS);
        shell.rm('-rf', 'npm/npm-bcrypt');
      }

      // FIX BSON
      if (shell.test('-e', 'npm/cfs_gridfs')) {
        shell.cd('npm/cfs_gridfs/node_modules/mongodb/node_modules/bson');
        shell.exec('make', SYNC_EXEC_OPTIONS);
      }

      const application = Applications.findOne({
        bundleId: file._id
      });

     /*
      * IMPORTANT!!!!
      * After installation is completed it will be updated before
      * the start if the application fix begin.
      */
      application.setStatus(3);
    }));
  }));
});
