import { Applications } from '../../applications/applications.js';
import { Bundles } from '../bundles.js';
import { BUNDLE_DIR, SYNC_EXEC_OPTIONS, ASYNC_EXEC_OPTIONS } from '../utils.js';

// NPM PACKAGES
import { cd, rm, mkdir, exec, test } from 'shelljs';

Bundles.on('stored', Meteor.bindEnvironment((file, storeName) => {
  const APPLICATION_DIR  = `${BUNDLE_DIR}/${file._id}`;

  // REMOVE OLD APPLICATION
  rm('-rf', APPLICATION_DIR);

  // CREATE NEW APPLICATION DIR
  mkdir(APPLICATION_DIR);

  // GO TO BUNDLE DIR
  cd(BUNDLE_DIR);

  // EXTRACT
  exec(`tar -xvzf ${file._id}.tar.gz -C ${file._id} --strip 1`, SYNC_EXEC_OPTIONS);

  // CD SERVER PACKAGES
  cd(`${file._id}/programs/server`);

  // NPM CORE PACKAGES INSTALL
  const npm = exec('npm install', ASYNC_EXEC_OPTIONS);

  npm.stdout.on('end', Meteor.bindEnvironment(() => {

    // FIX BCRYPT
    if (test('-e', 'npm/npm-bcrypt')) {
      exec('npm install bcrypt', SYNC_EXEC_OPTIONS);
      rm('-rf', 'npm/npm-bcrypt');
    }

    // FIX BSON
    if (test('-e', 'npm/cfs_gridfs')) {
      cd('npm/cfs_gridfs/node_modules/mongodb/node_modules/bson');
      exec('make', SYNC_EXEC_OPTIONS);
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
