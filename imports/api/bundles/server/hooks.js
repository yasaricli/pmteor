import { Bundles } from '../bundles.js';
import { BUNDLE_DIR, SYNC_EXEC_OPTIONS } from '../utils.js';

// NPM PACKAGES
import { cd, mkdir, exec } from 'shelljs';

Bundles.on('stored', ({ _id }) => {

  // CD BUNDLE DIRECTORY
  cd(BUNDLE_DIR);

  // CREATE NEW APPLICATION DIR
  mkdir(_id);

  // EXTRACT
  exec(`tar -xvzf ${_id}.tar.gz -C ${_id} --strip 1`, SYNC_EXEC_OPTIONS);
});
