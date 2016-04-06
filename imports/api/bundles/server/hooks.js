import { Applications } from '../../applications/applications.js';
import { Bundles } from '../bundles.js';
import { BUNDLE_DIR, SYNC_EXEC_OPTIONS, ASYNC_EXEC_OPTIONS } from '../utils.js';

// NPM PACKAGES
import { rm, cd, mkdir, exec, test, find } from 'shelljs';

Bundles.on('stored', Meteor.bindEnvironment((file, storeName) => {
  const { _id } = file;

  // CD BUNDLE DIRECTORY
  cd(BUNDLE_DIR);

  // CREATE NEW APPLICATION DIR
  mkdir(_id);

  // EXTRACT
  exec(`tar -xvzf ${_id}.tar.gz -C ${_id} --strip 1`, SYNC_EXEC_OPTIONS);

  // --------- REBUILDING FIBERS --------------
  cd(`${_id}/programs/server`);

  // GO NPM PACKAGES
  cd('npm');

  // BINARY NPM MODULES
  const bindingFiles = find('.').filter((file) => {
    return file.match(/\.gyp$/);
  });

  bindingFiles.forEach((file) => {
    const dir = file.replace('/binding.gyp', '');

    // GO TO BINDING FILE DIR
    cd(dir);

    // REMOVE BEFORE MODULES
    rm('-rf', 'node_modules');

    // INSTALL MODULES
    exec('npm install', SYNC_EXEC_OPTIONS);

    // AND REBUILD BINDINGS PACKAGES.
    exec('node-gyp rebuild', SYNC_EXEC_OPTIONS);

    // PREV DIR
    cd('-');
  });

  // PROGRAMS SERVER DIR
  cd('..');

  // support for 0.9
  if (test('-e', 'package.json')) {

    exec('npm install', SYNC_EXEC_OPTIONS);
  } else {

    // support for older versions
    exec('npm install fibers bcrypt', SYNC_EXEC_OPTIONS);
  }

  // APPLICATION
  const application = Applications.findOne({ bundleId: _id });

 /*
  * IMPORTANT!!!!
  * After installation is completed it will be updated before
  * the start if the application fix begin.
  */
  application.setStatus(3);
}));
